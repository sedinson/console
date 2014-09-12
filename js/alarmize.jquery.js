(function ($) {
    $.fn.alarmize = function (onsave, data, options) {
        var _options = {
            readonly: false,
            textSave: 'GUARDAR'
        }, _data = {
            hour    : '12',
            min     : '30',
            action  : 'start',
            days    : []
        };
        
        options = (options)? options : {};
        data = (data)? data : {};
        
        for(var key in options) {
            _options[key] = options[key];
        }
        
        for(var key in data) {
            _data[key] = data[key];
        }
        
        var hour = [
            '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
            '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
        ], min = [
            '00', '05', '10', '15', '20', '25',
            '30', '35', '40', '45', '50', '55'
        ], day = [
            'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sab'
        ], hours = $("<select/>", {
            name: 'hour',
            'class': 'alarmize-clock-hours'
        }), mins = $("<select/>", {
            'class': 'alarmize-clock-hours',
            name: 'min'
        }), days = $('<div/>', {
            class: 'alarmize-days'
        });
        
        if(!_options.readonly) {
            for(var i in hour) {
                hours.append(
                    $("<option/>", {
                        value   : hour[i],
                        text    : hour[i]
                    })
                );
            }

            for(var i in min) {
                mins.append(
                    $("<option/>", {
                        value   : min[i],
                        text    : min[i]
                    })
                );
            }
        } else {
            hours = $("<span/>").html(
                _data.hour
            );
            
            mins = $("<span/>").html(
                _data.min
            );
        }
        
        for(var i in day) {
            var check = false;
            
            for(var j=0; j<_data.days.length; j++) {
                check = (_data.days[j] == i)? 'checked' : check;
            }
            
            days.append(
                $('<label/>', {
                    class: 'alarmize-day'
                }).append(
                    $('<input/>', {
                        name: 'day',
                        type: 'checkbox',
                        checked: check,
                        value: i,
                        disabled: (options.readonly)? 'disabled' : false
                    })
                ).append(
                    $('<span/>', {
                        html: day[i]
                    })
                )
            )
        }
        
        var action = (!_options.readonly)?
        $("<select/>", {
                class: 'alarmize-action',
                name: 'action'
            }).append(
                $('<option/>', {
                    value: 'stop',
                    text: 'Detener'
                })
            ).append(
                $('<option/>', {
                    value: 'start',
                    text: 'Iniciar'
                })
            ).append(
                $('<option/>', {
                    value: 'reboot',
                    text: 'reiniciar'
                })
            ) : $("<span/>", {
                class: 'alarmize-action',
                html: _data.action
            });
        
        var alarm = $('<form/>', {
            class: 'alarmize-container'
        }).append(
            $('<div/>', {
                class: 'alarmize-head'
            }).append(
                $('<div/>', {
                    class: 'alarmize-clock'
                }).append(
                    hours
                ).append(
                    $('<span/>', {
                        html: ':'
                    })
                ).append(
                    mins
                )
            ).append(
                $('<a/>', {
                    class: 'alarmize-delete',
                    html: (_options.onDelete)? 'Eliminar' : ''
                }).click(function () {
                    if(_options.onDelete) {
                        _options.onDelete(_data);
                    }
                })
            ).append(
                action
            )
        ).append(
            days
        ).submit(function (e) {
            onsave(e, $(this).serializeArray(), _data);
        });
        
        if(!_options.readonly) {
            alarm.append(
                $('<button/>', {
                    class: 'alarmize-save',
                    html: _options.textSave
                })
            );
        }
        
        this.html(alarm);
        hours.val(_data.hour);
        mins.val(_data.min);
        action.val(_data.action);
        
        return this;
    };
})(jQuery);