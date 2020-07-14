import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalConstants } from '../../@core/constant/GlobalConstants';
import { PermissionModel } from './permission.model';
import { PermissionService } from './permission.service';
import {
  NzDropdownMenuComponent,
  NzFormatEmitEvent,
  NzMessageService,
  NzModalRef,
  NzModalService,
  NzTreeComponent,
  NzTreeNode
} from 'ng-zorro-antd';
import { HttpParams } from '@angular/common/http';
import { ResponseResultModel } from '../../@core/net/response-result.model';
import { PagerResultModel } from '../../@core/net/pager-result.model';
import { PermissionEditComponent } from './permission-edit/permission-edit.component';
import { validatePerms } from '../../@core/util/perms-validators';
import { ApplicationService } from '../application/application.service';
import { listToTree, TreeNode } from '../../@core/util/tree-node';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  /** 全局常量  */
  global: GlobalConstants = GlobalConstants.getInstance();
  /** 应用树 */
  @ViewChild('applicationTree') applicationTree: NzTreeComponent;
  /** 选中的应用节点 */
  activedNode: NzTreeNode;
  /** 应用树数据 */
  nodes: TreeNode[] = [];
  /** 查询参数  */
  params: any = {
    code: '',
    name: '',
    types: [],
    active: '',
    applicationCode: ''
  };
  /** 类型 */
  types: any[] = [];
  /** 是否启用  */
  activeArr: any[] = [];
  /** 当前页码  */
  pageNum: number = 1;
  /** 每页显示记录数  */
  pageSize: number = 10;
  /** 总记录数  */
  total: number = 0;
  /** 表格数据  */
  tableData: PermissionModel[] = [];
  /** 加载动画，默认关闭  */
  loading = false;
  /** 应用树加载动画，默认关闭 */
  treeLoading = false;
  /** 排序  */
  sortMap = {
    code: 'asc',
    name: null,
    url: null,
    type: null,
    active: null,
    createTime: null,
    updateTime: null
  };
  /** 页面权限校验  */
  perms = {
    save: false,
    update: false,
    delete: false
  };

  constructor(private permissionService: PermissionService,
              private applicationSerivce: ApplicationService,
              private nzMessageService: NzMessageService,
              private modalService: NzModalService) {
  }

  ngOnInit() {
    this.perms = {
      save: validatePerms(['permission:save']),
      update: validatePerms(['permission:update']),
      delete: validatePerms(['permission:delete'])
    };
    this.types = [
      {text: '需登录', value: this.global.PERMISSION_LOGIN},
      {text: '需认证', value: this.global.PERMISSION_AUTHOR},
      {text: '需授权', value: this.global.PERMISSION_PERMS}];
    this.activeArr = [
      {text: '启用', value: this.global.ACTIVE_ON},
      {text: '禁用', value: this.global.ACTIVE_OFF}];
    this.listTree();
    this.findAllByParam();
  }

  /**
   * 选中节点
   *
   * @param data
   */
  activeNode(data: NzFormatEmitEvent): void {
    if (this.activedNode && this.activedNode.key === data.node.key) {
      this.activedNode = null;
      this.params.applicationCode = '';
    } else {
      this.activedNode = data.node;
      this.params.applicationCode = this.activedNode.key;
    }
    this.findAllByParam();
  }

  /**
   * 展开节点
   *
   * @param data
   * @param $event
   */
  openFolder(data: NzTreeNode | NzFormatEmitEvent, $event): void {
    $event.preventDefault();
    // 阻止事件冒泡
    $event.stopPropagation();
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      data.node.isExpanded = !data.node.isExpanded;
    }
  }

  listTree(): void {
    // 加载动画开启
    this.treeLoading = true;
    this.applicationSerivce.findAll().subscribe((res: ResponseResultModel) => {
      // 判断返回结果是否为空或null
      if (res && res.result) {
        const result: PagerResultModel = res.result;
        this.nodes = listToTree(result.list, 1);
      }
      // 加载动画关闭
      this.treeLoading = false;
    });
  }

  /**
   * 获取列表信息
   */
  findAllByParam(): void {
    // 加载动画开启
    this.loading = true;
    const param = {
      'criterias': [
        {'feild': 'code', 'operator': 'like', 'value': this.params.code ? '%' + this.params.code + '%' : null},
        {'feild': 'name', 'operator': 'like', 'value': this.params.name ? '%' + this.params.name + '%' : null},
        {'feild': 'type', 'operator': 'in', 'values': this.params.types},
        {'feild': 'active', 'value': this.params.active},
        {'feild': 'applicationCode', 'value': this.params.applicationCode}
      ],
      'page': {
        'pageSize': this.pageSize,
        'pageNum': this.pageNum - 1
      },
      'sorts': this.getSorts()
    };
    this.permissionService.findAllByParam(new HttpParams().set('param', JSON.stringify(param))).subscribe((res: ResponseResultModel) => {
      // 判断返回结果是否为空或null
      if (res && res.result) {
        const result: PagerResultModel = res.result;
        this.tableData = result.list;
        this.total = result.total;
      }
      // 加载动画关闭
      this.loading = false;
    });
  }

  /**
   * 过滤方法
   *
   * @param types
   * @param active
   */
  filter(types: string[], active: string): void {
    this.params.types = [...types];
    this.params.active = !!active ? active : '';
    this.findAllByParam();
  }

  /**
   * 排序监听
   *
   * @param name
   * @param value
   */
  sort(name: string, value: string): void {
    for (const key of Object.keys(this.sortMap)) {
      if (key === name) {
        this.sortMap[key] = value;
      }
    }
    this.findAllByParam();
  }

  /**
   * 获取排序参数
   */
  getSorts(): any[] {
    const arr = [];
    for (const key of Object.keys(this.sortMap)) {
      if (this.sortMap[key] != null) {
        arr.push({field: key, orderBy: this.sortMap[key].replace('end', '')});
      }
    }
    return arr;
  }

  /**
   * 打开新增页面
   */
  showSave() {
    const modal = this.openModel(this.global.INSERT_FLAG, this.params.applicationCode, '新增权限信息');
    // 模态框打开后回调事件
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // 模态框关闭后回调事件
    modal.afterClose.subscribe((result) => {
      if (result && result.refresh) {
        // 刷新列表
        this.findAllByParam();
      }
    });
    // 延时到模态框实例创建
    window.setTimeout(() => {
      const instance = modal.getContentComponent();
      instance.title = 'sub title is changed';
    }, 2000);
  }

  /**
   * 打开修改页面
   *
   * @param id 权限ID
   */
  showUpdate(id: string) {
    const modal = this.openModel(id, null, '修改权限信息');
    // 模态框打开后回调事件
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // 模态框关闭后回调事件
    modal.afterClose.subscribe((result) => {
      if (result && result.refresh) {
        // 刷新列表
        this.findAllByParam();
      }
    });
  }

  /**
   * 删除前确认
   *
   * @param id 用户ID
   */
  confirmDelete(id: string): void {
    this.deleteById(id);
  }

  /**
   * 取消删除事件回调
   */
  cancelDelete(): void {
    this.nzMessageService.info(this.global.DELETE_CANTER_MSG);
  }

  /**
   * 由ID删除权限信息
   *
   * @param id 权限ID
   */
  deleteById(id: string) {
    const msgId = this.nzMessageService.loading(this.global.DELETE_LOADING_MSG).messageId;
    this.permissionService.deleteById(id).subscribe((res: ResponseResultModel) => {
      this.nzMessageService.remove(msgId);
      /// 判断返回状态码是否为200（成功状态码）
      if (res.status === 200) {
        this.nzMessageService.success(this.global.DELETE_SUCESS_MSG);
      }
      this.findAllByParam();
    });
  }

  /**
   * 打开模态框
   *
   * @param id 权限ID
   * @param applicationCode 应用ID
   * @param title 模态框标题
   */
  openModel(id: string, applicationCode: string, title: string): NzModalRef {
    return this.modalService.create({
      nzTitle: title,
      nzContent: PermissionEditComponent,
      nzWidth: 600,
      nzComponentParams: {
        id: id,
        applicationCode: applicationCode
      },
      nzFooter: [
        {
          label: '返回',
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }
        },
        {
          label: '提交',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance.submitForm();
          }
        }
      ]
    });
  }

}
