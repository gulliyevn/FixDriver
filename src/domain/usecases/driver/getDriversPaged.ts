import { DriverListParams, DriverListDto } from '../../../data/datasources/driver/DriverTypes';
import DriverService from '../../../data/datasources/driver/DriverService';
import { APIResponse } from '../../../data/datasources/api/APITypes';

/**
 * Usecase: fetch paged drivers with optional search
 */
export const getDriversPaged = async (
  params: DriverListParams
): Promise<APIResponse<DriverListDto>> => {
  return DriverService.getDriversPaged(params);
};

export default getDriversPaged;


