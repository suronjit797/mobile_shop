import { useLocation, useNavigate } from "react-router-dom";

type QueryParams = Record<string, string | number | boolean | undefined>;

export const useQueryParams = (defaultParams: QueryParams = {}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current query params (merged with defaults)
  const getQueryParams = (): QueryParams => {
    const searchParams = new URLSearchParams(location.search);
    const params: QueryParams = { ...defaultParams }; // Start with defaults

    // Override defaults with actual URL values
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  };

  // Set query params (preserve defaults if not overridden)
  const setQueryParams = (newParams: QueryParams) => {
    const currentParams = new URLSearchParams(location.search);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        currentParams.delete(key);
      } else {
        currentParams.set(key, String(value));
      }
    });

    navigate({ search: currentParams.toString() }, { replace: true });
  };

  // Get only non-empty params (excluding defaults if unused)
  const getNonEmptyQueryParams = (): QueryParams => {
    const params = getQueryParams();
    return Object.fromEntries(
      Object.entries(params).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined && value !== "",
      ),
    );
  };

  return {
    queryParams: getQueryParams(), // Merged with defaults
    setQueryParams,
    getNonEmptyQueryParams: getNonEmptyQueryParams(),
  };
};
