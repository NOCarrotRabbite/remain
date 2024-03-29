/*
    此文件为数据接口存放命名，为防止接口太多，造成接口混乱
    命名为大写斜杠
    按页面划分
    例如： 'ORDER_API': '/api/order',
    每个接口注释用途，为方面其他开发人员查找，了解。
    export default {
    } */
export default {
  // 登录
  LOGIN_API: '/back_wusheng/manager_login.php',
  // 在线统计
  ONLINE_STATISTICS_API: '/back_wusheng/list_online_stat.php',
  // 系统参数
  SYSTEM_PARAM_API: '/back_wusheng/list_system_para.php',
  // 用户信息
  USERMESSAGE_API: '/back_wusheng/list_user.php',
  // 游戏列表
  GAMESLIST_API: '/back_wusheng/list_game.php',
  // 金币统计
  GOLD_STATISTICS_API: '/back_wusheng/list_money_stat.php',
  // 用户管理
  USERLIST_API: '/back_wusheng/list_manager.php',
  // 登录日志
  LOGLIST_API: '/back_wusheng/list_manager_login_record.php',
  // 管理员操作日志
  ADMIN_ACTION_API: '/back_wusheng/list_manager_operate.php',
  // 管理员修改密码
  SETMANAGEPWD_API: '/back_wusheng/set_manager_login_pwd.php',
  // 新增管理员
  ADDMANAGER_API: '/back_wusheng/add_manager.php',
  // 删除管理员
  DELMANAGER_API: '/back_wusheng/del_manager.php',
  // 封禁/解封管理员
  SETMANAGERLOCKED_API: '/back_wusheng/set_manager_locked.php',

  /* 用户 */
  // 在线玩家
  ONLINELIST_API: '/back_wusheng/list_online_user.php',
  // 修改用户登录密码
  SETHUASRPWD_API: '/back_wusheng/set_user_login_pwd.php',
  // 修改用户ID
  SETUSERID_API: '/back_wusheng/set_user_number.php',
  // 修改用户类型
  SETUSERTYPE_API: '/back_wusheng/set_user_type.php',
  // 封禁/解封用户
  SETUSERLOCKED_API: '/back_wusheng/set_user_locked.php',
  // 修改金币
  SETMONEY_API: '/back_wusheng/set_user_money.php',
  // 用户登录日志
  USERLOGINLOG_API: '/back_wusheng/list_user_login_record.php',
  // 用户操作日志
  USEROPERATELOG_API: '/back_wusheng/list_user_operate_record.php',
  /* 运营 */
  // 系统公告
  LISTNOTICE_API: '/back_wusheng/list_notice.php',
  // 新增系统公告
  ADDNOTICE_API: '/back_wusheng/add_notice.php',
  // 删除公告
  DELNOTICE_API: '/back_wusheng/del_notice.php',
  // 修改公告
  MODIFYNOTICE_API: '/back_wusheng/modify_notice.php',
  // 修改系统参数
  EDITSYSTEMPARA_API: '/back_wusheng/modify_system_para.php',
  // 修改游戏库存
  MODIFYSTORAGE_API: '/back_wusheng/modify_storage.php',
  // 获取玩家点控列表
  LISTUSERRTP_API: '/back_wusheng/list_user_rtp_buff.php',
  // 新增+修改玩家点控
  SETUSERRTP_API: '/back_wusheng/set_user_rtp_buff.php',
  // 留存统计
  RETENTION_API: '/back_wusheng/list_remain_stat.php',
  // 获取游戏相关客服人员
  CUSTOMER_API: '/back_wusheng/list_service_guy.php',
  // 新增游戏客服人员
  ADD_CUSTOMER_API: '/back_wusheng/add_service_guy.php',
  // 删除游戏上显示的客服人员
  DELETE_CUSTOMER_API: '/back_wusheng/del_service_guy.php',
  // 获取游戏上显示的充值人员
  CHARGE_STAFF_API: '/back_wusheng/list_recharge_guy.php',
  // 增加游戏上显示的充值人员
  ADD_CHARGE_STAFF_API: '/back_wusheng/add_recharge_guy.php',
  // 删除游戏上显示的充值人员
  DELETE_CHARGE_STAFF_API: '/back_wusheng/del_recharge_guy.php',
  // 代理商充值兑换排行
  RANKAGEENT_API: '/back_wusheng/rank_agent.php',
  // 玩家充值兑换排行
  PLAYER_CHARGE_RANK_API: '/back_wusheng/rank_user.php',
  // 获取用户赠送日志
  GIFT_RECORDS_API: '/back_wusheng/list_user_transfer_record.php',
  // 财富总榜+每日金榜展示列表
  TREASURELISTRANK_API: '/back_wusheng/list_rank.php',
  // 新增排行
  ADDRANK_API: '/back_wusheng/add_rank.php',
  // 删除排行
  DELRANK_API: '/back_wusheng/del_rank.php',
  // 玩家输赢排行榜
  WIN_LOSE_RANK_API: '/back_wusheng/rank_user_profit.php',
  // 获取用户兑换账户配置信息
  EXECHANGE_ACCOUNT_CONFIG_API: '/back_wusheng/list_user_exchange_set.php',
  // 获取用户兑换日志
  EXECHANGE_RECORDS_API: '/back_wusheng/list_user_exchange_record.php',
  // 设置用户兑换状态
  SET_STATUS_API: '/back_wusheng/set_user_exchange_record_status.php',
  // 获取百万大赢家记录
  MILLIONAIRE_RECORDS_API: '/back_wusheng/list_dyj_record.php',
  // 用户输赢记录
  LISTUSERPLARGAMEPROFIT_API: '/back_wusheng/list_user_playgame_profit.php',
  // 获取邮件列表
  SYSTEMMAILLIST_API: '/back_wusheng/list_system_mail.php',
  // 新增邮件
  ADDSYSTEMMAIL_API: '/back_wusheng/add_system_mail.php',
  // 回收率统计
  RECOVERYSTATLIST_API: '/back_wusheng/list_recovery_stat.php',
  // 获取推广员列表
  PROMOTER_LIST_API: '/back_wusheng/list_promoter.php',
  // 获取推广员下面成员列表
  PROMOTER_DETAIL_API: '/back_wusheng/list_promoter_detail.php',
  // 获取推广积分兑换记录
  POINT_REDEMPTION_API: '/back_wusheng/list_exchange_promote_score_record.php',
  // 获取角色列表
  LIST_ROLE_API: '/back_wusheng/list_role.php',
  // 添加角色
  ADD_ROLE_API: '/back_wusheng/add_role.php',
  // 删除角色
  DEL_ROLE_API: '/back_wusheng/del_role.php',
  // 设置角色权限
  SET_PRIVILEGE_API: '/back_wusheng/set_privilege.php',
  // 获取库存曲线
  GAMESTORAGELIST_API: '/back_wusheng/list_game_storage_stat.php',
  // 新手卡查询
  LIST_CARD_API: '/back_wusheng/list_card.php',
  // 生成新手卡
  ADD_CARD_API: '/back_wusheng/add_card.php'
};
