/** @jsx h */
import preact, { h, render, Component } from 'preact';
import merge from 'lodash.merge';
import { getHash, isHttps } from 'utils';
import Connect from '../connect/connect';
import { GET_NEWS_LIST, GET_TOP_NEWS } from '../../common/constants/constants';
import { LATEST_NEWS, LIKE_NEWS } from '../constants/constants';

import Scroll from 'scroll-p';
import Spinner from 'spinner-p';
import List from '../components/list/index';
import Tab from '../components/tab/index';
import Loading from '../components/loading/index';

require('./index.less');

class Wrapper extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			
		};
		this.firstGetAllData = false;
		this.loadTopNews = this.loadTopNews.bind(this);
		this.loadNewsList = this.loadNewsList.bind(this);
		this.loadData = this.loadData.bind(this);
		this.loadDataForScroll = this.loadDataForScroll.bind(this);
	}

	componentDidMount() {
		
	}

	componentWillMount() {
		this.loadTopNews();
	}

	componentWillReceiveProps(nextProps) {
		this.props.toggleSpinLoading(false);
		
		return true;
	}

	loadDataForScroll() {
		this.loadNewsList(null);
	}

	loadTopNews() {
		var url = GET_TOP_NEWS,
			opts = {};

		var pa = merge({}, {
			chlid: 'news_news_top',
			refer: 'mobilewwwqqcom',
			otype: 'jsonp',
			jsonCbName: 'getNewsIndexOutput',
			t: (new Date()).getTime()
		}, pa);

		var param = {
			param: pa,
			ajaxType: 'JSONP',
			onSuccess: function(res) {
				// console.log(res);
			},
			onError: function(res) {
				// console.log(res);
				// alert(res.errMsg || '加载新闻列表失败，请稍后重试');
			}
		};

		this.props.request(url, param, opts);
	}

	loadNewsList(props) {
		var props = props || this.props;

		this.loadData(LATEST_NEWS, {});
	}

	//http://mat1.gtimg.com/www/mobi/image/loadimg.png

	loadData(listType, pa = {}, opts = {}) {
		var _this = this;
		var url = GET_NEWS_LIST;

		var listInfoParam = this.props.news.listInfo['listLatest'],
			ids = this.props.news.ids,
			args = this.props.args;

		// 防止重复拉取
		if (listInfoParam.isLoading) {
			return;
		}

		var curPage = listInfoParam.curPage,
			page_size = listInfoParam.pageSize,
			startIndex = 0 + (curPage - 1) * page_size,
			endIndex = startIndex + page_size;

		var newIds = ids.slice(startIndex, endIndex),
			newIdArray = [];

		newIds.forEach((item, index) => {
			newIdArray.push(item.id);
		});

		var pa = merge({}, {
			cmd: GET_NEWS_LIST,
			ids: newIdArray.join(','),
			refer: "mobilewwwqqcom",
			otype: "jsonp",
			jsonCbName: "getNewsContentOnlyOutput",
			t: (new Date()).getTime(),
		}, pa);

		var param = {
			param: pa,
			ajaxType: 'JSONP',
			onSuccess: function(data) {
				// console.log(data);
			},
			onError: function(res) {
				console.log("err");
				// console.log(res);
				// alert(res.errMsg || '加载新闻列表失败，请稍后重试');
			}
		};

		this.props.request(url, param, opts);
	}

	render() {

		console.dev('render container!!!');
		let tabStyle = this.props.tabs,
			isEnd = this.props.news.listInfo['listLatest']['isEnd'],
			isLoadingShow = tabStyle === LATEST_NEWS;

		return (
	        <article className="cm-page">
	        	<Tab
	        		tabs={this.props.tabs}
	        		updateActiveTab={this.props.updateActiveTab}
	        	/>
	            <div className="cm-content">
	            	<Scroll 
	            			wrapper={".content-wrap"}
	            			loadDataForScroll={this.loadDataForScroll}
	            	>
	            		<List 
							  tabs={this.props.tabs}
							  tabsType={LATEST_NEWS}
							  news={this.props.news.listLatest}
							  listInfo={this.props.news.listInfo.listLatest}
							  args={this.props.args}
							  request={this.props.request}
							  likeNews={this.props.likeNews}
						/>
						<List 
							  tabs={this.props.tabs}
							  tabsType={LIKE_NEWS}
							  news={this.props.news.listLike}
							  listInfo={this.props.news.listInfo.listLike}
							  args={this.props.args}
							  request={this.props.request}
							  dislikeNews={this.props.dislikeNews}
						/>
						<Loading isShow={isLoadingShow} isEnd={isEnd} />
	            	</Scroll>
	            </div>
	            <Spinner isShow={this.props.spinLoading}/>
	        </article>
		)
	}
}

export default Connect(Wrapper);