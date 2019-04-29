const data = {
  用户权限管理: {
    在线玩家: { 查看列表: 'list_online_user' },
    用户信息: {
      查看列表: 'list_user',
      修改类型: 'set_user_type',
      修改金币: 'set_user_money',
      修改密码: 'set_user_login_pwd',
      封禁用户: 'set_user_locked'
    },
    金币记录: { 查看记录: 'list_money_stat' },
    输赢记录: { 查看列表: 'list_user_playgame_profit' },
    百万大赢家记录: { 查看列表: 'list_dyj_record' },
    用户登录日志: { 查看列表: 'list_user_login_record' },
    用户操作日志: { 查看列表: 'list_user_operate_record' },
    兑换账户配置: { 查看列表: 'list_user_exchange_set' }
  },
  充值权限管理: {
    充值人员: {
      查看列表: 'list_recharge_guy',
      添加人员: 'add_recharge_guy',
      删除人员: 'del_recharge_guy'
    },
    '兑换记录/兑换订单': {
      查看列表: 'list_user_exchange_record',
      设置状态: 'set_user_exchange_record_status'
    },
    赠送记录: { 查看列表: 'list_user_transfer_record' },
    玩家充值排行: { 查看列表: 'rank_user' },
    代理商充值排行: { 查看列表: 'rank_agent' },
    充值回收率: { 查看列表: 'list_recovery_stat' }
  },
  运营权限管理: {
    在线统计: { 查看图表: 'list_online_stat' },
    留存统计: { 查看列表: 'list_remain_stat' },
    输赢排行: { 查看列表: 'rank_user_profit' },
    系统公告: {
      查看列表: 'list_notice',
      新增公告: 'add_notice',
      删除公告: 'del_notice',
      修改公告: 'modify_notice'
    },
    系统客服: {
      查看列表: 'list_service_guy',
      新增客服: 'add_service_guy',
      删除客服: 'del_service_guy'
    },
    系统邮件: {
      查看列表: 'list_system_mail',
      新增邮件: 'add_system_mail'
    },
    系统参数: {
      查看列表: 'list_system_para',
      修改参数: 'modify_system_para'
    }
  },
  推广权限管理: {
    推广员列表: {
      查看列表: 'list_promoter',
      成员列表: 'list_promoter_detail'
    },
    积分兑换记录: {
      查看列表: 'list_exchange_promote_score_record'
    }
  },
  控制权限管理: {
    GM控制: {
      查看列表: 'list_user_rtp_buff',
      '新增/修改配置': 'set_user_rtp_buff'
    },
    库存曲线: { 查看图表: 'list_game_storage_stat' },
    游戏列表: {
      查看列表: 'list_game',
      修改库存: 'modify_storage'
    },
    '财富总榜/每日金榜': {
      查看列表: 'list_rank',
      新增排行: 'add_rank',
      删除排行: 'del_rank'
    }
  },
  账户权限管理: {
    权限设置: {
      查看列表: 'list_role',
      新增角色: 'add_role',
      删除角色: 'del_role',
      修改权限: 'set_privilege'
    },
    账户设置: { 修改密码: 'set_manager_login_pwd' },
    用户管理: {
      查看列表: 'list_manager',
      新增用户: 'add_manager',
      封禁用户: 'set_manager_locked',
      删除用户: 'del_manager'
    },
    操作日志: { 查看列表: 'list_manager_operate' },
    登录日志: { 查看列表: 'list_manager_login_record' }
  }
};
const setData = {
  add_manager: false,
  add_notice: false,
  add_rank: false,
  add_recharge_guy: false,
  add_role: false,
  add_service_guy: false,
  add_system_mail: false,
  del_manager: false,
  del_notice: false,
  del_rank: false,
  del_recharge_guy: false,
  del_role: false,
  del_service_guy: false,
  list_dyj_record: false,
  list_exchange_promote_score_record: false,
  list_game: false,
  list_game_storage_stat: false,
  list_manager: false,
  list_manager_login_record: false,
  list_manager_operate: false,
  list_money_stat: false,
  list_notice: false,
  list_online_stat: false,
  list_online_user: false,
  list_promoter: false,
  list_promoter_detail: false,
  list_rank: false,
  list_recharge_guy: false,
  list_recovery_stat: false,
  list_remain_stat: false,
  list_role: false,
  list_service_guy: false,
  list_system_mail: false,
  list_system_para: false,
  list_user: false,
  list_user_exchange_record: false,
  list_user_exchange_set: false,
  list_user_login_record: false,
  list_user_operate_record: false,
  list_user_playgame_profit: false,
  list_user_rtp_buff: false,
  list_user_transfer_record: false,
  modify_notice: false,
  modify_storage: false,
  modify_system_para: false,
  rank_agent: false,
  rank_user: false,
  rank_user_profit: false,
  set_manager_locked: false,
  set_manager_login_pwd: false,
  set_privilege: false,
  set_user_exchange_record_status: false,
  set_user_locked: false,
  set_user_login_pwd: false,
  set_user_money: false,
  set_user_number: false,
  set_user_rtp_buff: false,
  set_user_type: false
};
export default {
  data,
  setData
};
