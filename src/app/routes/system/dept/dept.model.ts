import { BaseTreeSortModel } from '../../../@core/model/base-tree-sort.model';
import { RoleModel } from '../role/role.model';

/**
 * 部门model
 */
export class DeptModel extends BaseTreeSortModel {

  /** 简称 */
  shortName: string;
  /** 部门拥有角色信息 */
  roles: RoleModel[];

}
