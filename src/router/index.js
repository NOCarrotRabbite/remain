import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login/Login';
import Layout from '@/views/layout/Layout';
import PermissionManage from '@/views/permission/permission-manage/PermissionManage';
import AddRole from '@/views/permission/permission-manage/AddRole';
import AccountSet from '@/views/permission/AccountSet';
import UserManage from '@/views/permission/user-manage/UserManage';
import AddUser from '@/views/permission/user-manage/AddUser';
import ActionLog from '@/views/permission/ActionLog';
import LoginLog from '@/views/permission/LoginLog';
import OnlineUser from '@/views/user/OnlineUser';
import UserInfo from '@/views/user/UserInfo';
import GoldRecords from '@/views/user/GoldRecords';
import WinloseRecords from '@/views/user/WinloseRecords';
import MillionaireRecords from '@/views/user/MillionaireRecords';
import UserLoginLog from '@/views/user/UserLoginLog';
import UserOperateLog from '@/views/user/UserOperateLog';
import ExechangeAccountConfig from '@/views/user/ExechangeAccountConfig';
import ChargeRecords from '@/views/charge/ChargeRecords';
import ExchangeRecords from '@/views/charge/ExchangeRecords';
import ExchangeOrders from '@/views/charge/ExchangeOrders';
import GiftRecords from '@/views/charge/GiftRecords';
import RenandexcRank from '@/views/charge/RenandexcRank';
import AgentRank from '@/views/charge/AgentRank';
import RecoveryStatistics from '@/views/charge/RecoveryStatistics';
import ChargeStaff from '@/views/charge/ChargeStaff';
import RetentionStatistics from '@/views/operative/RetentionStatistics';
import OnlineStatistics from '@/views/operative/OnlineStatistics';
import WinLoseRanking from '@/views/operative/WinLoseRanking';
import SystemNotification from '@/views/operative/SystemNotification';
import SystemCustomerService from '@/views/operative/SystemCustomerService';
import SystemMail from '@/views/operative/SystemMail';
import SystemParam from '@/views/operative/SystemPramers';
import NoviceCard from '@/views/operative/NoviceCard';
import PromoterList from '@/views/spread/PromoterList';
import PromoterDetailedData from '@/views/spread/PromoterDetailedData';
import PointRedemptionRecord from '@/views/spread/PointRedemptionRecord';
import StockControl from '@/views/control/StockControl';
import PointControl from '@/views/control/PointControl';
import AddPoint from '@/views/control/AddPoint';
import gamesList from '@/views/control/gamesList';
import TreasureRank from '@/views/control/TreasureRank';
import GlodRank from '@/views/control/GlodRank';
import AddRank from '@/views/control/AddRank';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    /* 设置默认指向路径 */
    {
      path: '/',
      redirect: '/login'
    },
    /*  登录页面路由 */
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    /*  后台主页面路由 */
    {
      path: '/user/online_user',
      component: Layout,
      redirect: '/user/online_user',
      children: [
        /*  用户页面路由开始 */
        {
          path: '/user/online_user',
          component: OnlineUser,
          name: '在线玩家',
          meta: { title: '在线玩家', requireAuth: true }
        },
        {
          path: '/user/user_info',
          component: UserInfo,
          name: '用户信息',
          meta: { title: '用户信息', requireAuth: true }
        },
        {
          path: '/user/gold_records',
          component: GoldRecords,
          name: '金币记录',
          meta: { title: '金币记录', requireAuth: true }
        },
        {
          path: '/user/lose_win_records',
          component: WinloseRecords,
          name: '输赢记录',
          meta: { title: '输赢记录', requireAuth: true }
        },
        {
          path: '/user/millionaire_records',
          component: MillionaireRecords,
          name: '百万大赢家记录',
          meta: { title: '百万大赢家记录', requireAuth: true }
        },
        {
          path: '/user/user_login_log',
          component: UserLoginLog,
          name: '用户登录日志',
          meta: { title: '用户登录日志', requireAuth: true }
        },
        {
          path: '/user/user_operate_log',
          component: UserOperateLog,
          name: '用户操作日志',
          meta: { title: '用户操作日志', requireAuth: true }
        },
        {
          path: '/user/exchange_account_config',
          component: ExechangeAccountConfig,
          name: '用户兑换配置信息',
          meta: { title: '用户兑换配置信息', requireAuth: true }
        },
        /*  用户页面路由结束 */

        /*  充值页面路由开始 */
        {
          path: '/charge/charge_records',
          component: ChargeRecords,
          name: '充值记录',
          meta: { title: '充值记录', requireAuth: true }
        },
        {
          path: '/charge/charge_staff',
          component: ChargeStaff,
          name: '充值人员',
          meta: { title: '充值人员', requireAuth: true }
        },
        {
          path: '/charge/exchange_records',
          component: ExchangeRecords,
          name: '兑换记录',
          meta: { title: '兑换记录', requireAuth: true }
        },
        {
          path: '/charge/exchange_orders',
          component: ExchangeOrders,
          name: '兑换订单',
          meta: { title: '兑换订单', requireAuth: true }
        },
        {
          path: '/charge/gift_records',
          component: GiftRecords,
          name: '赠送记录',
          meta: { title: '赠送记录', requireAuth: true }
        },
        {
          path: '/charge/renandexc_rank',
          component: RenandexcRank,
          name: '充值兑换排行',
          meta: { title: '充值兑换排行', requireAuth: true }
        },
        {
          path: '/charge/agent_rank',
          component: AgentRank,
          name: '代理商排行',
          meta: { title: '代理商排行', requireAuth: true }
        },
        {
          path: '/charge/recovery_statistics',
          component: RecoveryStatistics,
          name: '回收率统计',
          meta: { title: '回收率统计', requireAuth: true }
        },
        /*  充值页面路由结束 */

        /*  运营页面路由开始 */
        {
          path: '/operative/retention_statistics',
          component: RetentionStatistics,
          name: '留存统计',
          meta: { title: '留存统计', requireAuth: true }
        },
        {
          path: '/operative/online_statistics',
          component: OnlineStatistics,
          name: '在线统计',
          meta: { title: '在线统计', requireAuth: true }
        },
        {
          path: '/operative/win_lose_ranking',
          component: WinLoseRanking,
          name: '玩家排行',
          meta: { title: '玩家排行', requireAuth: true }
        },
        {
          path: '/operative/system_notification',
          component: SystemNotification,
          name: '系统公告',
          meta: { title: '系统公告', requireAuth: true }
        },
        {
          path: '/operative/system_customer_service',
          component: SystemCustomerService,
          name: '系统客服',
          meta: { title: '系统客服', requireAuth: true }
        },
        {
          path: '/operative/system_mail',
          component: SystemMail,
          name: '系统邮件',
          meta: { title: '系统邮件', requireAuth: true }
        },
        {
          path: '/operative/system_param',
          component: SystemParam,
          name: '系统参数',
          meta: { title: '系统参数', requireAuth: true }
        },
        {
          path: '/operative/novice_card',
          component: NoviceCard,
          name: '新手卡',
          meta: { title: '新手卡', requireAuth: true }
        },

        /*  运营页面路由结束 */

        /*  推广页面路由开始 */
        {
          path: '/spread/promoter_list',
          component: PromoterList,
          name: '推广员列表',
          meta: { title: '推广员列表', requireAuth: true },
          children: [
            {
              path: '/spread/promoter_detailed_data',
              component: PromoterDetailedData,
              name: '推广员详细数据',
              meta: { title: '推广员详细数据', requireAuth: true }
            }
          ]
        },
        {
          path: '/spread/point_redemption_record',
          component: PointRedemptionRecord,
          name: '积分兑换记录',
          meta: { title: '积分兑换记录', requireAuth: true }
        },
        /*  推广页面路由结束 */

        /*  权限页面路由开始 */
        {
          path: '/permission/permission_set',
          component: PermissionManage,
          name: '权限设置',
          meta: { title: '权限设置' },
          children: [
            {
              path: '/permission/AddRole',
              component: AddRole,
              name: '编辑权限',
              meta: { title: '编辑权限', requireAuth: true }
            }
          ]
        },
        {
          path: '/permission/account_set',
          component: AccountSet,
          name: '账户设置',
          meta: { title: '账户设置', requireAuth: true }
        },
        {
          path: '/permission/user_manage',
          component: UserManage,
          name: '用户管理',
          meta: { title: '用户管理' },
          children: [
            {
              path: '/permission/AddUser',
              component: AddUser,
              name: '添加用户',
              meta: { title: '添加用户', requireAuth: true }
            }
          ]
        },
        {
          path: '/permission/action_log',
          component: ActionLog,
          name: '操作日志',
          meta: { title: '操作日志', requireAuth: true }
        },
        {
          path: '/permission/login_log',
          component: LoginLog,
          name: '登录日志',
          meta: { title: '登录日志', requireAuth: true }
        },

        /*  权限页面路由结束 */

        /* 控制页面路由开始 */
        {
          path: '/control/stock_curve',
          component: StockControl,
          name: '库存曲线',
          meta: { title: '库存曲线', requireAuth: true }
        },
        {
          path: '/control/gm_control',
          component: PointControl,
          name: 'GM控制',
          meta: { title: 'GM控制', requireAuth: true },
          children: [
            {
              path: '/control/AddPoint',
              component: AddPoint,
              name: '任务配置',
              meta: { title: '任务配置', requireAuth: true }
            }
          ]
        },
        {
          path: '/operative/games_list',
          component: gamesList,
          name: '游戏列表',
          meta: { title: '游戏列表', requireAuth: true }
        },
        {
          path: '/control/treasure_rank',
          component: TreasureRank,
          name: '财富总榜',
          meta: { title: '财富总榜', requireAuth: true },
          children: [
            {
              path: '/control/add_rank',
              component: AddRank,
              name: '添加排行',
              meta: { title: '添加排行', requireAuth: true }
            }
          ]
        },
        {
          path: '/control/glod_rank',
          component: GlodRank,
          name: '每日金榜',
          meta: { title: '每日金榜', requireAuth: true },
          children: [
            {
              path: '/control/add_rank',
              component: AddRank,
              name: '添加排行',
              meta: { title: '添加排行', requireAuth: true }
            }
          ]
        }
        /* { path: '/control/treasure_rank', component: TreasureRank, name: '财富总榜', meta: { title: '财富总榜', requireAuth: true } },
        { path: '/control/glod_rank', component: GlodRank, name: '每日金榜', meta: { title: '每日金榜', requireAuth: true } }, */
        /* 控制页面路由开始 */
      ]
    }
  ]
});
