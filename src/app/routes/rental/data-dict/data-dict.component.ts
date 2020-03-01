import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { GlobalConstants } from '../../../@core/constant/GlobalConstants';

@Component({
  selector: 'app-data-dict',
  templateUrl: './data-dict.component.html',
  styleUrls: ['./data-dict.component.scss']
})
export class DataDictComponent implements OnInit {

  /** 全局常量  */
  global: GlobalConstants = GlobalConstants.getInstance();

  /** 查询参数  */
  params: any = {
    contractCode: '',
    lesseeName: ''
  };
  /** 当前页码  */
  pageNum: number = 1;
  /** 每页显示记录数  */
  pageSize: number = 10;
  /** 总记录数  */
  total: number = 0;
  /** 表格数据  */
  tableData: any[] = [];
  /** 加载动画，默认关闭  */
  loading = false;
  /** 排序  */
  sortMap = {
    name: null,
    stop_time: 'desc',
    createTime: 'desc',
    updateTime: null
  };
  /** 页面权限校验  */
  perms = {
    save: false,
    update: false,
    delete: false
  };

  constructor(private nzMessageService: NzMessageService) {
  }

  ngOnInit() {
    this.perms = {
      save: true,
      update: true,
      delete: true
    };
    this.findAllByParam();
  }

  /**
   * 获取列表信息
   */
  findAllByParam(): void {
    // 加载动画开启
    // this.loading = true;
    // const params = new HttpParams()
    //   .set('account', this.params.account)
    //   .set('name', this.params.name)
    //   .set('active', this.params.active)
    //   .set('pageSize', this.pageSize.toString())
    //   .set('pageNum', this.pageNum.toString())
    //   .set('orderBy', this.getOrderBy());
    // this.userService.findAllByParam(params).subscribe((res: ResponseResultModel) => {
    //   // 判断返回结果是否为空或null
    //   if (res.result) {
    //     const result: PagerResultModel = res.result;
    //     this.tableData = result.list;
    //     this.total = result.total;
    //   }
    //   // 加载动画关闭
    //   this.loading = false;
    // });
    this.tableData = [{}];
  }

  /**
   * 过滤方法
   *
   * @param active
   */
  filter(active: string): void {
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
  getOrderBy(): string {
    const arr = [];
    for (const key of Object.keys(this.sortMap)) {
      if (this.sortMap[key] != null) {
        arr.push(key + ' ' + this.sortMap[key].replace('end', ''));
      }
    }
    return arr.toString();
  }

  /**
   * 打开新增页面
   */
  showSave() {
    // this.router.navigate(['/app/system/user-edit', this.global.INSERT_FLAG]);
  }

  /**
   * 打开修改页面
   *
   * @param id 数据字典ID
   */
  showUpdate(id: string) {
    // this.router.navigate(['/app/system/user-edit', id]);
  }

  /**
   * 删除前确认
   *
   * @param id 数据字典ID
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
   * 由ID删除数据字典信息
   *
   * @param id 数据字典ID
   */
  deleteById(id: string) {
    // const msgId = this.nzMessageService.loading(this.global.DELETE_LOADING_MSG).messageId;
    // this.userService.deleteById(id).subscribe((res: ResponseResultModel) => {
    //   this.nzMessageService.remove(msgId);
    //   // 判断返回状态码是否为200（成功状态码）
    //   if (res.status === 200) {
    this.nzMessageService.success(this.global.DELETE_SUCESS_MSG);
    //   }
    //   this.findAllByParam();
    // });
  }

}
