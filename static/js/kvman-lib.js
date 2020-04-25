/**
 * Kvm-Man
 * Powered By Luxiaok
 * https://github.com/luxiaok/kvman
 * */

//export default function(){
//    console.log('Call default');
//}


/* Icon图标
 * 0 - 叹号
 * 1 - 打勾
 * 2 - 打叉
 * 3 - 问号
 * 4 - 锁
 * 5 - 难过
 * 6 - Smile
 * */

/******** Base Module ********/

export const k = {
    get_time: function () {
        var _date = new Date(),
            year = _date.getFullYear(),
            month = _date.getMonth() + 1, //注意：getMonth返回的数据是0-11
            day = _date.getDate(),
            hours = _date.getHours(),
            minutes = _date.getMinutes(),
            seconds = _date.getSeconds();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    },
    log: function (logs) {
        var now = '[' + this.get_time() + ']';
        console.log(now, logs);
    },
    random: function (len) {
        if (!len) len = 8; //默认长度
        var _org_num = Math.random();
        if (_org_num < 0.1) len++; //解决0.0xxxx导致生成随机数位数不足问题
        var len_num = Math.pow(10, len);
        return parseInt(_org_num * len_num);
    }
};

/***********  Route Modules ***********/

/* 虚拟机开机 */
const guest_start = function (name, status) {
    var msg = '您确定要将虚拟机 ' + name + ' 开机吗？';
    if (status === 1) {
        layer.alert('该虚拟机已是开机状态！', {title: '开机提示', icon: 0});
        return false;
    }
    layer.confirm(msg, {icon: 3, title: '开机提示'}, function (index) {
        $.ajax({
            type: "POST",
            url: "/guest/start",
            data: {name: name},
            dataType: "json",
            success: function (resp) {
                var code = resp['code'],
                    msg = resp['msg'];
                if (code === 0) {
                    layer.close(index);
                    layer.msg(msg);
                    location.reload();
                } else if (code < 0) {
                    layer.close(index);
                    layer.msg(msg);
                } else {
                    layer.close(index);
                    layer.alert('开机失败，请稍后再试！', {title: '开机提示', icon: 0});
                }
            },
            error: function () {
                layer.close(index);
                layer.alert('系统繁忙，请稍后再试！', {title: '开机提示', icon: 2});
            }
        });
    });
};


/* 虚拟机关机 */
const guest_shutdown = function (name, status) {
    var msg = '您确定要将虚拟机 ' + name + ' 关机吗？';
    if (status === 0) {
        layer.alert('该虚拟机已是关机状态！', {title: '关机提示', icon: 0});
        return false;
    }
    layer.confirm(msg, {icon: 3, title: '关机提示'}, function (index) {
        $.ajax({
            type: "POST",
            url: "/guest/shutdown",
            data: {name: name, force: 'no'},
            dataType: "json",
            success: function (resp) {
                var code = resp['code'],
                    msg = resp['msg'];
                if (code === 0) {
                    layer.close(index);
                    layer.msg(msg);
                    location.reload();
                } else if (code < 0) {
                    layer.close(index);
                    layer.msg(msg);
                } else {
                    layer.close(index);
                    layer.alert('关机失败，请稍后再试！', {title: '关机提示', icon: 0});
                }
            },
            error: function () {
                layer.close(index);
                layer.alert('系统繁忙，请稍后再试！', {title: '关机提示', icon: 2});
            }
        });
    });
};


/* 虚拟机重启 */
const guest_reboot = function (name, status) {
    var msg = '您确定要将虚拟机 ' + name + ' 重启吗？';
    if (status === 0) {
        layer.alert('该虚拟机暂未开机！', {title: '重启提示', icon: 0});
        return false;
    }
    layer.confirm(msg, {icon: 3, title: '重启提示'}, function (index) {
        layer.msg('正在重启……');
        layer.close(index);
    });
};


/* 自动启动 */
const guest_autostart = function (name, autostart) {
    var msg, flag;
    if (autostart === 0) {
        msg = '您确定要将虚拟机 ' + name + ' 设置为自动启动吗？';
        flag = 1;
    } else {
        msg = '您确定取消虚拟机 ' + name + ' 的自动启动吗？';
        flag = 0;
    }
    layer.confirm(msg, {icon: 3, title: '操作提示'}, function (index) {
        $.ajax({
            type: "POST",
            url: "/guest/autostart",
            data: {name: name, flag: flag},
            dataType: "json",
            success: function (resp) {
                var code = resp['code'],
                    msg = resp['msg'];
                if (code === 0) {
                    layer.close(index);
                    layer.msg(msg);
                    location.reload();
                } else if (code < 0) {
                    layer.close(index);
                    layer.msg(msg);
                } else {
                    layer.close(index);
                    layer.alert('设置失败，请稍后再试！', {title: 'KvMan提示', icon: 0});
                }
            },
            error: function () {
                layer.close(index);
                layer.alert('系统繁忙，请稍后再试！', {title: 'KvMan提示', icon: 2});
            }
        });
    });
};


/* 远程连接 */
const guest_console = function (name, status) {
    if (status !== 1) {
        layer.alert('该主机未开机，无法连接！', {title: '远程连接提示', icon: 2});
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/guest/console",
        data: {guest: name},
        dataType: "json",
        success: function (resp) {
            var code = resp['code'],
                msg = resp['msg'];
            if (code === 0) {
                var url = '/guest/console?uuid=' + resp['data']['uuid'] + '&token=' + resp['data']['token'];
                window.open(url);
            } else if (code < 0) {
                layer.msg(msg);
            } else {
                layer.alert('获取远程连接失败，请稍后再试！', {title: 'KvMan提示', icon: 0});
            }
        },
        error: function () {
            layer.alert('系统繁忙，请稍后再试！', {title: 'KvMan提示', icon: 2});
        }
    });
};


/* 销毁虚拟机 */
const guest_destroy = function (name, status) {
    var msg = '您确定要将虚拟机 ' + name + ' 彻底销毁吗？';
    if (status === 1) {
        layer.alert('请先将虚拟机关闭！', {title: '销毁提示', icon: 0});
        return false;
    }
    layer.confirm(msg, {icon: 3, title: '销毁提示'}, function (index) {
        layer.msg('正在销毁……');
        layer.close(index);
    });
};


/* 导出路由表 */
export const route = {};

route.hello = function(){
    log('hello')
};

route.Index = {
    uri: '/',
    init: function () {
        k.log('Welcome to Kvman Dashboard center!');
    }
};

route.Guest = {
    uri: '/guest',
    init: function () {
        //开机
        $('.start-btn').click(function () {
            var name = $(this).data('name'),
                status = $(this).data('status');
            guest_start(name,status);
        });

        //关机
        $('.halt-btn').click(function () {
            var name = $(this).data('name'),
                status = $(this).data('status');
            guest_shutdown(name,status);
        });

        //重启
        $('.reboot-btn').click(function () {
            var name = $(this).data('name'),
                status = $(this).data('status');
            guest_reboot(name,status);
        });

        //自动启动
        $('.autostart-btn').click(function () {
            var name = $(this).data('name'),
                autostart = $(this).data('autostart');
            guest_autostart(name,autostart);
        });

        //远程连接
        $('.console-btn').click(function () {
            var name = $(this).data('name'),
                status = $(this).data('status');
            guest_console(name,status);
        });
    }
};


route.GuestDetail = {
    uri: '/guest/detail',
    init: function () {
        //开机
        $('#start-btn').click(function () {
            var name = $('#name').val().trim(),
                status = $('#name').data('status');
            guest_start(name,status);
        });

        //关机
        $('#halt-btn').click(function () {
            var name = $('#name').val().trim(),
                status = $('#name').data('status');
            guest_shutdown(name,status);
        });

        //重启
        $('#reboot-btn').click(function () {
            var name = $('#name').val().trim(),
                status = $('#name').data('status');
            guest_reboot(name,status);
        });

        //远程连接
        $('#console-btn').click(function () {
            var name = $('#name').val().trim(),
                status = $('#name').data('status');
            guest_console(name,status);
        });

        //销毁虚拟机
        $('#destroy-btn').click(function () {
            var name = $('#name').val().trim(),
                status = $('#name').data('status');
            guest_destroy(name,status);
        });
    }
};