var _status = {
    0  : 'Pendiente...',
    16 : 'Corriendo',
    32 : 'Apagando...',
    48 : 'Finalizado',
    64 : 'Deteniendo...',
    80 : 'Detenido'
}, first = true;

$('#stateServices').text('Servicio [Off]');

var Instances = {
    list: {},
    selected: null,
    load: function () {
        uget({
            url: LinkServer.Url('account', 'instances')
        }).done(function (data) {
            $('#stateServices').text('Servicio [On]');
            console.log('Servicio [On]');
            if(data._code === 200) {
                var table = $("#table-instances");
                
                //Analizar si hay que borrar una instancia en la lista que tenemos previamente
                for(var _instanceId in Instances.list) {
                    var sw = false;
                    for(var i=0; i<data._response.length; i++) {
                        sw = (sw)? true : data._response[i].InstanceId == _instanceId;
                    }
                    
                    if(!sw) {
                        table.find("#" + _instanceId).remove();
                        delete Instances.list[_instanceId];
                        console.log("removed " + _instanceId);
                    }
                }
                
                //Analizar las instancias regresadas por el Rest
                for(var i=0; i<data._response.length; i++) {
                    var tmp = data._response[i];
                    
                    if(Instances.list[tmp.InstanceId]) {
                        var instance = table.find("#" + tmp.InstanceId);
                        
                        instance.find(".i_name").html(tmp.Name);
                        instance.find(".i_status").html(
                            $("<span/>", {
                                class: 'st-' + tmp.State.Code,
                                html: _status[tmp.State.Code]
                            })
                        );
                        // instance.find(".i_arch").html(tmp.Architecture);
                        instance.find(".i_ip").html(tmp.PrivateIp ? tmp.PrivateIp + (tmp.PublicIp ? " / " + tmp.PublicIp : '') : '');
                        instance.find(".i_type").html(tmp.Type);
                        instance.find(".i_launch").find("button").html(
                                    "<i class='fa fa-clock-o fa-fw'></i> " + tmp.schedulers + ' horario' + ((tmp.schedulers == 1)? "" : "s")
                                );
                        //instance.find(".i_alarm").find("button").html(
                        //            "<i class='fa fa-clock-o fa-fw'></i> " + tmp.Alarms + ' alarma' + ((tmp.Alarms == 1)? "" : "s")
                        //        );
                    } else {
                        var tr = $("<tr/>", {
                            id: tmp.InstanceId,
                            class: 'gradeA'
                        });
                        
                        $("<td/>")
                            .append(
                                $("<input/>", {
                                    type: 'checkbox',
                                    name: 'instance',
                                    value: tmp.InstanceId
                                })
                            ).appendTo(tr);
                        
                        $("<td/>", {
                            class: 'i_name',
                            html: tmp.Name
                        }).appendTo(tr);
                        
                        $("<td/>", {
                            class: 'i_type',
                            html: tmp.Type
                        }).appendTo(tr);
                        
                        $("<td/>", {
                            class: 'i_status'
                        }).html(
                            $("<span/>", {
                                class: 'st-' + tmp.State.Code,
                                html: _status[tmp.State.Code]
                            })
                        ).appendTo(tr);
                        
                        $("<td/>", {
                            class: 'i_ip',
                            html: tmp.PrivateIp ? tmp.PrivateIp + (tmp.PublicIp ? " / " + tmp.PublicIp : '') : ''
                        }).appendTo(tr);
                        
                        (function (_tmp) {
                            $("<td/>", {
                                class: 'i_launch'
                            }).html(
                                $("<button/>", {
                                    class: 'btn btn-regular'
                                }).html(
                                    "<i class='fa fa-clock-o fa-fw'></i> " + _tmp.schedulers + ' horario' + ((_tmp.schedulers == 1)? "" : "s")
                                ).click(function (e) {
                                    e.preventDefault();

                                    Instances.scheduler(_tmp.InstanceId, _tmp.Name);
                                })
                            ).appendTo(tr);
                        })(tmp);

                        /*(function (_tmp) {
                            $("<td/>", {
                                class: 'i_alarm'
                            }).html(
                                $("<button/>", {
                                    class: 'btn btn-regular'
                                }).html(
                                    "<i class='fa fa-clock-o fa-fw'></i> " + _tmp.Alarms + ' alarma' + ((_tmp.Alarms == 1)? "" : "s")
                                ).click(function (e) {
                                    e.preventDefault();

                                    Instances.alarms(_tmp.InstanceId, _tmp.Name);
                                })
                            ).appendTo(tr);
                        })(tmp);*/
                        
                        tr.appendTo(table);
                    }
                    
                    Instances.list[tmp.InstanceId] = {
                        Name         : tmp.Name,
                        Type         : tmp.Type,
                        Architecture : tmp.Architecture,
                        Status       : tmp.State.Code,
                        Launch       : tmp.Launch
                    };
                }
                
                if(first) {
                    table.tablesorter();
                    first = false;
                }
            }
        }).error(function (data){
            $('#stateServices').text('Servicio [Off]');
            console.log('Servicio [Off]');
        });
    },
    refresh: function () {
        Instances.load();
        setTimeout(function () {
            Instances.refresh();
        }, 10000);
    },
    scheduler: function (instanceID, instanceName) {
        Instances.selected = instanceID;
        
        $("#instances-page").css({
            display: 'none'
        });
        
        $("#scheduler-page").css({
            display: 'block'
        }).find(".page-header").html(
            instanceName
        ).append(
            $("<a/>", {
                href: '#',
                html: '[volver]'
            }).css({
                'font-size': '0.6em',
                position: 'relative',
                float: 'right'
            }).click(function (e) {
                e.preventDefault();
                
                $("#instances-page").css({
                    display: 'block'
                });

                $("#scheduler-page").css({
                    display: 'none'
                });
            })
        );
        
        uget({
            type: 'GET',
            url: LinkServer.Url('scheduler', 'get', {
                instanceID: instanceID
            })
        }).done(function (data) {
            var workflow = $("#schedulerWork");

            if(data._code == 200) {
                workflow.empty();
                
                for(var i in data._response) {
                    var ob = data._response[i]
                      , tmp = ob._hour.split(':')
                      , params = {
                            hour: tmp[0],
                            min: tmp[1],
                            action: ob._action,
                            instanceID: ob.instanceID,
                            days: ob._day
                        }
                    ;

                    $("<div/>", {
                        class: 'floatining'
                    }).appendTo(
                        workflow
                    ).alarmize(function (event, data, prev) {
                        event.preventDefault();
                        
                        newScheduler(data, prev);
                    }, params, {
                        readonly: false,
                        onDelete: function (prev) {
                            var remove = confirm("Desea eliminar la tarea?");
                            
                            if(remove) {
                                var del = {
                                    instanceID: prev.instanceID,
                                    _hour: prev.hour + ':' + prev.min
                                }

                                uget({
                                    type: 'DELETE',
                                    url: LinkServer.Url('scheduler', 'delete'),
                                    data: del
                                }).done(function (data) {
                                    if(data._code == 200) {
                                        showModal('Tarea eliminada');
                                        Instances.scheduler(prev.instanceID, prev.instanceName);
                                    } else {
                                        showModal(data._message);
                                    }
                                });
                            }
                        }
                    });
                }
                
                $("<div/>", {
                    class: 'floatining newe'
                }).appendTo(
                    workflow
                ).alarmize(function (event, data, prev) {
                    event.preventDefault();

                    newScheduler(data, prev);
                }, {instanceID: instanceID, instanceName: instanceName}, {readonly: false, textSave: 'AÑADIR', onDelete: false});
            } else {
                showModal(data._message);
            }
        });
    }
};

function showModal(context){
    var footer = $("<button/>",{
            class: 'btn btn-primary',
            'data-dismiss': 'modal',
            type: 'button'
        }).html("Aceptar");
    $('#myModal .modal-title').html('Console - Soluntech');
    $('#myModal .modal-footer').html(footer);
    $('#myModal .contex-text').text(context);
    $('#myModal').modal('show');
}

function newScheduler (data, prev) {
    var del = {
        instanceID: prev.instanceID,
        _hour: prev.hour + ':' + prev.min
    }

    uget({
        type: 'DELETE',
        url: LinkServer.Url('scheduler', 'delete'),
        data: del
    }).done(function (d) {
        if(d._code == 200) {
            var params = {
                instanceID  : prev.instanceID,
                _hour       : data[0].value + ':' + data[1].value,
                _action     : data[2].value,
                days        : []
            };

            for(var i in data) {
                if(data[i].name == 'day') {
                    params.days.push(data[i].value);
                }
            }

            uget({
                type: 'POST',
                url: LinkServer.Url('scheduler', 'add'),
                data: params
            }).done(function (data) {
                if(data._code == 200) {
                    showModal('Tareas configuradas');
                    Instances.scheduler(prev.instanceID, prev.instanceName);
                } else {
                    showModal(data._message);
                }
            });
        } else {
            showModal(data._message);
        }
    });
}

function modalConfirm (context, method) {
    $('.modal-footer').html('<button data-dismiss="modal" type="button" class="btn btn-default">Cancel</button><button onclick="modalOk(\''+method+'\')" type="button" class="btn btn-primary">Ok</button>');
    
    showModal(context);
}

function modalOk(method){
    console.log( method );
    if(method == 'start'){
        var form = $("#frm-instances");
        var checks = parametrizer(form, true);
        var instancesId = checks.instance.join('|');
        uget({
            url: LinkServer.Url('instance', 'start', {
                instanceids: encodeURIComponent(instancesId)
            })
        }).done(function (data) {
            if(data._code === 200) {
                Instances.load();
            } else {
                showModal(data._message);
            }
        });
    }else if(method == 'stop'){
        var form = $("#frm-instances");
        var checks = parametrizer(form, true);
        var instancesId = checks.instance.join('|');
        uget({
            url: LinkServer.Url('instance', 'stop', {
                instanceids: encodeURIComponent(instancesId)
            })
        }).done(function (data) {
            if(data._code === 200) {
                Instances.load();
            } else {
                showModal(data._message);
            }
        });
    }else if(method == 'reboot'){
        var form = $("#frm-instances");
        var checks = parametrizer(form, true);
        var instancesId = checks.instance.join('|');
        uget({
            url: LinkServer.Url('instance', 'reboot', {
                instanceids: encodeURIComponent(instancesId)
            })
        }).done(function (data) {
            if(data._code === 200) {
                Instances.load();
            } else {
                showModal(data._message);
            }
        });
    }

    $('#myModal').modal('hide');
    $("#table-instances tbody input[type=checkbox]").prop('checked', false);
}

$(function () {
    uget({
        url: LinkServer.Url('user', 'active')
    }).done(function (data) {
        if(data._code !== 200) {
            logout();
        }else{
            $('#userName').text(data._response['user']);
        }
    });
    
    $("#checkAll").click(function () {
        $("#table-instances tbody input[type=checkbox]").prop('checked',$(this).is(':checked'));
    });
    
    $("#start").click(function (e) {
        e.preventDefault();
        modalConfirm("Desea iniciar las instancias seleccionadas?", "start");
    });
    
    $("#stop").click(function (e) {
        e.preventDefault();
        modalConfirm("Desea detener las instancias seleccionadas?", "stop");
    });
    
    $("#reboot").click(function (e) {
        e.preventDefault();
        modalConfirm("Desea reiniciar las instancias seleccionadas?", "stop");
    });
    
    Instances.refresh();
});

function logout () {
    uget({
        url     : LinkServer.Url('user', 'logout')
    }).done(function (data) {
        location.href = 'index.html';
    });
}