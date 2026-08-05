/**
 * Validation Guardrails for RXSAAS
 * Prevents common errors during development
 */

export const validators = {
  /**
   * Validates API response format
   */
  validateApiResponse: (response: any) => {
    if (!response) {
      throw new Error("Response is null or undefined");
    }
    if (typeof response !== "object") {
      throw new Error(`Expected object, got ${typeof response}`);
    }
    if (!("success" in response)) {
      throw new Error("Response missing 'success' field");
    }
    return response;
  },

  /**
   * Validates form data before submission
   */
  validateFormData: (data: any, requiredFields: string[]) => {
    const missing = requiredFields.filter((field) => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }
    return data;
  },

  /**
   * Validates hook initialization
   */
  validateHookInit: (deps: any[]) => {
    if (!Array.isArray(deps)) {
      throw new Error("Dependencies must be an array");
    }
    return deps;
  },

  /**
   * Validates component props
   */
  validateComponentProps: (props: any, schema: Record<string, string>) => {
    const errors: string[] = [];

    Object.entries(schema).forEach(([key, type]) => {
      if (!(key in props)) {
        errors.push(`Missing prop: ${key}`);
      } else if (typeof props[key] !== type) {
        errors.push(`Prop ${key} has wrong type. Expected ${type}, got ${typeof props[key]}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
    return props;
  },

  /**
   * Validates database connection
   */
  validateDbConnection: async (db: any) => {
    if (!db) {
      throw new Error("Database client not initialized");
    }
    try {
      // Test query
      await db.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }
  },
};

/**
 * Custom hook validation wrapper
 */
export function createValidatedHook<T>(
  hookName: string,
  hookFn: () => T,
  validation?: (result: T) => void
): T {
  try {
    const result = hookFn();
    if (validation) {
      validation(result);
    }
    return result;
  } catch (error) {
    console.error(`Hook validation error in ${hookName}:`, error);
    throw new Error(`Failed to initialize hook ${hookName}: ${error}`);
  }
}

/**
 * API response wrapper with validation
 */
export async function fetchWithValidation(
  url: string,
  options?: RequestInit
): Promise<any> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return validators.validateApiResponse(data);
  } catch (error) {
    throw new Error(`Failed to fetch from ${url}: ${error}`);
  }
}

/**
 * Pre-submit form validation
 */
export function validateBeforeSubmit(
  formData: any,
  requiredFields: string[],
  customValidators?: Record<string, (value: any) => boolean>
): boolean {
  // Check required fields
  validators.validateFormData(formData, requiredFields);

  // Run custom validators
  if (customValidators) {
    Object.entries(customValidators).forEach(([field, validator]) => {
      if (!validator(formData[field])) {
        throw new Error(`Validation failed for field: ${field}`);
      }
    });
  }

  return true;
}
