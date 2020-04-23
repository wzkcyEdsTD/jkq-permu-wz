import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  //  后置表达式分类
  expressionType: '-1',
  //  行为标签
  behaviorLabelId: undefined,
  isEnabled: '1',
  updateEnd: undefined,
  updateStart: undefined,
  keyword: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class EcommerceBillStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
  }

  @observable
  _list = [];
  @computed.struct
  get list() {
    return this._list;
  }

  @observable
  _pageQuery = initPage;

  @observable
  _query = initTable;

  @action
  reset() {
    this._pageQuery = initPage;
    this._query = initTable;
    this._list = [];
  }

  @action
  fetchDataList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQuery),
      query: query(this._query)
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/ecommerce/processBankData',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  @action
  check = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/ecommerce/checkBillsExpression',
      params
    });
    return data;
  };

  @action
  editEcommerceData = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/ecommerce/processedBankDataEdit',
      params
    });
    return data;
  };

  @action
  fetchTagTree = async type => {
    const url =
      type == 1
        ? '/behaviorLabel/bankTransactionquery'
        : '/behaviorLabel/bankChannelquery';
    const data = await this.ForwardAPI.toJava({
      url,
      params: {}
    });
    return data;
  };
}

export default EcommerceBillStore;
