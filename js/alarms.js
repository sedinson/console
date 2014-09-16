var AccountId = null;
    $('#stateServices').text('Servicio [Off]');

var Alarms = {
    list: {},
    selected: null,
    load: function () {
        uget({
            url: LinkServer.Url('alarm', 'get')
        }).done(function (data) {
            $('#stateServices').text('Servicio [On]');
            console.log('Servicio [On]');
            if(data._code === 200) {
                var cpu = $("#cpu");
                cpu.empty();
                // cpu.append('<br>');

                var billing = $("#billing");
                billing.empty();
                billing.append('<br>');
                var html = "";

                var TempInstances

                uget({
                    url: LinkServer.Url('account', 'instances')
                }).done(function (data2) {
                    if(data2._code === 200) {
                        console.log('ok Servicio');
                        TempInstances = data2._response;

                        for (var i = 0; i <= data._response.length; i++){
                            var tempInstanceName = null;
                            for (var j = 0; j < TempInstances.length; j++){
                                if(TempInstances[j].InstanceId == data._response[i]['Dimensions'][0].Value){
                                    tempInstanceName = TempInstances[j].Name;
                                }
                            }

                            if(data._response[i].Namespace == 'AWS/EC2'){

                                var tempButton = "";

                                switch(data._response[i].StateValue){
                                    case "OK":
                                        tempButton += '<div class="alert alert-success" role="alert" style="padding:2px; margin:0; float:right; margin-top:-3px;"><i class="glyphicon glyphicon-exclamation-sign"></i> Ok</div>';
                                        break;
                                    case "ALARM":
                                        tempButton += '<div class="alert alert-danger" role="alert" style="padding:2px; margin:0; float:right; margin-top:-3px;"><i class="glyphicon glyphicon-exclamation-sign"></i> Alarma</div>';
                                        break;
                                    case "INSUFFICIENT_DATA":
                                        tempButton += '<div class="alert alert-warning" role="alert" style="padding:2px; margin:0; float:right; margin-top:-3px;"><i class="glyphicon glyphicon-exclamation-sign"></i> Insuficiente</div>';
                                        break;
                                }

                                html = '<div class="panel-heading">'+
                                            '<h4 class="panel-title">'+
                                                tempButton +
                                                '<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+ i +'">'+
                                                    tempInstanceName + ': ' + data._response[i].AlarmName +
                                                '</a>'+
                                            '</h4>' +
                                        '</div>'+
                                        '<div id="collapse'+ i +'" class="panel-collapse collapse">'+
                                            '<div class="panel-body">';

                                html += '<div class="well col-md-6 init">'+
                                    '<button type="button" class="close" onclick="AlarmDelete(\''+ data._response[i].AlarmName +'\')"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><br>'+
                                    '<div class="form-group">'+
                                        '<div class="row">'+
                                            '<div class="col-md-6">'+
                                                '<label>Siempre que sea: </label>'+
                                                '<select id="'+ i +'Statistic" class="form-control">';

                                switch(data._response[i]['Statistic']){
                                    case "Average":
                                        html += '<option selected value="Average">Promedio</option>'+
                                                '<option value="Minimum">Minimo</option>'+
                                                '<option value="Maximum">Maximo</option>'+
                                                '<option value="Sum">Total</option>'+
                                                '<option value="SampleCount">SampleCount</option>';
                                        break;
                                    case "Minimum":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option selected value="Minimum">Minimo</option>'+
                                                '<option value="Maximum">Maximo</option>'+
                                                '<option value="Sum">Total</option>'+
                                                '<option value="SampleCount">SampleCount</option>';
                                        break;
                                    case "Maximum":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option value="Minimum">Minimo</option>'+
                                                '<option selected value="Maximum">Maximo</option>'+
                                                '<option value="Sum">Total</option>'+
                                                '<option value="SampleCount">SampleCount</option>';
                                        break;
                                    case "Sum":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option value="Minimum">Minimo</option>'+
                                                '<option value="Maximum">Maximo</option>'+
                                                '<option selected value="Sum">Total</option>'+
                                                '<option value="SampleCount">SampleCount</option>';
                                        break;
                                    case "SampleCount":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option value="Minimum">Minimo</option>'+
                                                '<option value="Maximum">Maximo</option>'+
                                                '<option value="Sum">Total</option>'+
                                                '<option selected value="SampleCount">SampleCount</option>';
                                        break;
                                }
                                                   
                                html +=         '</select>'+
                                            '</div>'+
                                            '<div class="col-md-6">'+
                                                '<label>De:</label>'+
                                                '<select id="'+ i +'MetricName" onchange="changeLabelAlarm(\'' + i + '\')" class="form-control">';

                                switch(data._response[i]['MetricName']){
                                    case "CPUUtilization":
                                        html += '<option selected value="CPUUtilization">Consumo de CPU</option>'+
                                                '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                                '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                                '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                                '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                                '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                        break;
                                    case "NetworkOut":
                                        html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                                '<option selected value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                                '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                                '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                                '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                                '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                        break;
                                    case "DiskReadBytes":
                                        html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                                '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                                '<option selected value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                                '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                                '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                                '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                        break;
                                    case "DiskReadOps":
                                        html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                                '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                                '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                                '<option selected value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                                '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                                '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                        break;
                                    case "DiskWriteBytes":
                                        html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                                '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                                '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                                '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                                '<option selected value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                                '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                        break;
                                    case "NetworkIn":
                                        html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                                '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                                '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                                '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                                '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                                '<option selected value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                        break;
                                    default :
                                        html += '<option value="0">No estimado</option>';
                                }


                                html +=         '</select>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="form-group">'+
                                        '<div class="row">'+
                                            '<div class="col-md-6">'+
                                                '<label>Es:</label>'+
                                                '<select id="'+ i +'ComparisonOperator" class="form-control">';

                                switch(data._response[i]['ComparisonOperator']){
                                    case "GreaterThanThreshold":
                                        html += '<option selected value="GreaterThanThreshold">></option><option value="GreaterThanOrEqualToThreshold">>=</option><option value="LessThanThreshold"><</option><option value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                    case "GreaterThanOrEqualToThreshold":
                                        html += '<option value="GreaterThanThreshold">></option><option selected value="GreaterThanOrEqualToThreshold">>=</option><option value="LessThanThreshold"><</option><option value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                    case "LessThanThreshold":
                                        html += '<option value="GreaterThanThreshold">></option><option value="GreaterThanOrEqualToThreshold">>=</option><option selected value="LessThanThreshold"><</option><option value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                    case "LessThanOrEqualToThreshold":
                                        html += '<option value="GreaterThanThreshold">></option><option value="GreaterThanOrEqualToThreshold">>=</option><option value="LessThanThreshold"><</option><option selected value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                }

                                html +=         '</select>'+
                                            '</div>'+
                                            '<div class="col-md-6">'+
                                                '<label id="'+ i +'changeLabelForm">Porcentaje:</label>'+
                                                '<input id="'+ i +'Threshold" class="form-control" type="text" value="'+ data._response[i]['Threshold'].substring(0,data._response[i]['Threshold'].length-2) +'">'+
                                            '</div>'+
                                        '</div>'+  
                                    '</div>'+
                                    '<div class="form-group">'+
                                        '<div class="row">'+
                                            '<div class="col-md-6">'+
                                                '<label>Por lo menos:</label><br>'+
                                                '<input id="'+ i +'EvaluationPeriods" class="form-control" type="text" value="'+ data._response[i]['EvaluationPeriods'] +'">'+
                                            '</div>'+
                                            '<div class="col-md-6">'+
                                                '<label>Período(s) de</label>'+
                                                '<select id="'+ i +'Period" class="form-control">';

                                switch(data._response[i]['Period']){
                                    case "60":
                                        html += '<option selected value="60">1 Minuto</option>'+
                                                '<option value="300">5 Minutos</option>'+
                                                '<option value="900">15 Minutos</option>'+
                                                '<option value="3600">1 Hora</option>'+
                                                '<option value="21600">6 Hora</option>'+
                                                '<option value="86400">1 Dia</option>';
                                        break;
                                    case '300':
                                        html += '<option value="60">1 Minuto</option>'+
                                                '<option selected value="300">5 Minutos</option>'+
                                                '<option value="900">15 Minutos</option>'+
                                                '<option value="3600">1 Hora</option>'+
                                                '<option value="21600">6 Hora</option>'+
                                                '<option value="86400">1 Dia</option>';
                                        break;
                                    case "900":
                                        html += '<option value="60">1 Minuto</option>'+
                                                '<option value="300">5 Minutos</option>'+
                                                '<option selected value="900">15 Minutos</option>'+
                                                '<option value="3600">1 Hora</option>'+
                                                '<option value="21600">6 Hora</option>'+
                                                '<option value="86400">1 Dia</option>';
                                        break;
                                    case "3600":
                                        html += '<option value="60">1 Minuto</option>'+
                                                '<option value="300">5 Minutos</option>'+
                                                '<option value="900">15 Minutos</option>'+
                                                '<option selected value="3600">1 Hora</option>'+
                                                '<option value="21600">6 Hora</option>'+
                                                '<option value="86400">1 Dia</option>';
                                        break;
                                    case "21600":
                                        html += '<option value="60">1 Minuto</option>'+
                                                '<option value="300">5 Minutos</option>'+
                                                '<option value="900">15 Minutos</option>'+
                                                '<option value="3600">1 Hora</option>'+
                                                '<option selected value="21600">6 Hora</option>'+
                                                '<option value="86400">1 Dia</option>';
                                        break;
                                    case "86400":
                                        html += '<option value="60">1 Minuto</option>'+
                                                '<option value="300">5 Minutos</option>'+
                                                '<option value="900">15 Minutos</option>'+
                                                '<option value="3600">1 Hora</option>'+
                                                '<option value="21600">6 Hora</option>'+
                                                '<option selected value="86400">1 Dia</option>';
                                        break;
                                }

                                html +=         '</select>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="form-group">'+
                                        '<div class="row">'+
                                            '<div class="col-md-6">'+
                                                '<label>Realice la acción:</label>'+
                                                '<fieldset id="changeCombox">'+
                                                    '<select id="'+ i +'ActionAlarm" class="form-control">';

                                if(data._response[i]['OKActions'][0] != null){
                                    switch(data._response[i]['OKActions'][0]){
                                        case "arn:aws:automate:us-east-1:ec2:stop":
                                            html += '<option selected value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        case "arn:aws:automate:us-east-1:ec2:terminate":
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option selected value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        default:
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option selected value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                    }
                                }

                                if(data._response[i]['AlarmActions'][0] != null){
                                    switch(data._response[i]['AlarmActions'][0]){
                                        case "arn:aws:automate:us-east-1:ec2:stop":
                                            html += '<option selected value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        case "arn:aws:automate:us-east-1:ec2:terminate":
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option selected value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        default :
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option selected value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                    }
                                }

                                if(data._response[i]['InsufficientDataActions'][0] != null){
                                    switch(data._response[i]['InsufficientDataActions'][0]){
                                        case "arn:aws:automate:us-east-1:ec2:stop":
                                            html += '<option selected value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        case "arn:aws:automate:us-east-1:ec2:terminate":
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option selected value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        default:
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                                    '<option selected value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                    }
                                }
                                                       
                                html +=             '</select>'+
                                                '</fieldset>'+
                                            '</div>'+
                                            '<div class="col-md-6">'+
                                                '<label>Cuando esta alarma:</label>'+
                                                '<select id="'+ i +'SelectAlarm" class="form-control">';

                                if(data._response[i]['OKActions'][0] != null){
                                    html += '<option value="ALARM">Estado de Alarma</option>'+
                                            '<option selected value="OK">Estado Ok</option>'+
                                            '<option value="INSUFFICIENT_DATA">Estado Insuficiente</option>';
                                }else if(data._response[i]['AlarmActions'][0] != null){
                                    html += '<option selected value="ALARM">Estado de Alarma</option>'+
                                            '<option value="OK">Estado Ok</option>'+
                                            '<option value="INSUFFICIENT_DATA">Estado Insuficiente</option>';
                                }else if(data._response[i]['AlarmActions'][0] != null){
                                    html += '<option value="ALARM">Estado de Alarma</option>'+
                                            '<option value="OK">Estado Ok</option>'+
                                            '<option value="INSUFFICIENT_DATA">Estado Insuficiente</option>';
                                }

                                html +=        '</select>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="form-group">';

                                html += '<label>Instancia:</label> ' + tempInstanceName +
                                        '<input type="hidden" id="'+ i +'Instances" value="' + data._response[i]['Dimensions'][0].Value + '">' +
                                    '</div>'+
                                    '<div class="form-group">'+
                                        '<label>Nombre de Alarma:</label>'+
                                        '<input id="'+ i +'NameAlarm" class="form-control" type="text" value="' + data._response[i]['AlarmName'] + '"><hr>'+
                                    '</div>'+
                                    '<div class="text-right">'+
                                        '<div class="row">'+
                                            '<div class="col-md-6 text-center">';
                           
                                switch(data._response[i]['StateValue']){
                                    case "OK":
                                        html += '<div class="alert alert-success" role="alert" style="padding:6px; margin: 0;"><i class="glyphicon glyphicon-exclamation-sign"></i> Ok</div>';
                                        break;
                                    case "ALARM":
                                        html += '<div class="alert alert-danger" role="alert" style="padding:6px; margin: 0;"><i class="glyphicon glyphicon-exclamation-sign"></i> Alarma</div>';
                                        break;
                                    case "INSUFFICIENT_DATA":
                                        html += '<div class="alert alert-warning" role="alert" style="padding:6px; margin: 0;"><i class="glyphicon glyphicon-exclamation-sign"></i> Insuficiente</div>';
                                        break;
                                } 

                                html +=         '</div>'+
                                                '<div class="col-md-6">'+
                                                    '<button onclick="editAlarm(\''+ i +'\')" type="submit" class="btn btn-default"><i class="glyphicon glyphicon-ok"></i> Guardar Alarma</button>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';

                                // html += '<div class="well col-md-5 col-md-offset-1"><h4>Historial</h4><div id="history'+ i +'"></div></div>'
                                html += "</div></div>";

                                cpu.append(html);
                                html = "";

                            }else if(data._response[i]['Namespace'] == 'AWS/Billing'){
                                html = '<div class="well col-md-4 init">'+
                                        '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><br>'+
                                        '<div class="form-group">'+
                                            '<label>Nombre:</label> '+
                                            '<input class="form-control" type="text" value="'+ data._response[i]['AlarmName'] +'"> '+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<label>Descripcion:</label> '+
                                            '<input class="form-control" type="text" value="'+data._response[i]['AlarmDescription']+'"> '+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<div class="row">'+
                                                '<div class="col-md-6">'+
                                                    '<label>Es:</label> '+
                                                    '<select class="form-control">';
                                switch(data._response[i]['ComparisonOperator']){
                                    case "GreaterThanThreshold":
                                        html += '<option selected value="GreaterThanThreshold">></option><option value="GreaterThanOrEqualToThreshold">>=</option><option value="LessThanThreshold"><</option><option value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                    case "GreaterThanOrEqualToThreshold":
                                        html += '<option value="GreaterThanThreshold">></option><option selected value="GreaterThanOrEqualToThreshold">>=</option><option value="LessThanThreshold"><</option><option value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                    case "LessThanThreshold":
                                        html += '<option value="GreaterThanThreshold">></option><option value="GreaterThanOrEqualToThreshold">>=</option><option selected value="LessThanThreshold"><</option><option value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                    case "LessThanOrEqualToThreshold":
                                        html += '<option value="GreaterThanThreshold">></option><option value="GreaterThanOrEqualToThreshold">>=</option><option value="LessThanThreshold"><</option><option selected value="LessThanOrEqualToThreshold"><=</option>';
                                        break;
                                }
                               
                                html +=             '</select>'+
                                                '</div>'+
                                                '<div class="col-md-6">'+
                                                    '<label>USD $:</label> '+
                                                    '<input class="form-control" type="text" value="'+ data._response[i]['Threshold'].substring(0,data._response[i]['Threshold'].length-2) +'"> '+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                        '<div class="row">'+
                                            '<div class="col-md-6">'+
                                                '<label>Realice la acción:</label>'+
                                                '<fieldset id="changeCombox">'+
                                                    '<select id="disabledSelect" class="form-control">'+
                                                        '<option value="arn:aws:sns:us-east-1:482407636571:NotifyMe">Notificarme</option>'+
                                                    '</select>'+
                                                '</fieldset>'+
                                            '</div>'+
                                            '<div class="col-md-6">'+
                                                '<label>Cuando esta alarma:</label>'+
                                                '<select class="form-control">'+
                                                    '<option value="1">Estado de Alarma</option>'+
                                                    '<option value="2">Estado Ok</option>'+
                                                    '<option value="3">Estado Insuficiente</option>'+
                                                '</select>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                        '<div class="text-right">'+
                                            '<div class="row">'+
                                                '<div class="col-md-6 text-center">';

                                                switch(data._response[i]['StateValue']){
                                                    case "OK":
                                                        html += '<div class="alert alert-success" role="alert" style="padding:6px; margin: 0;"><i class="glyphicon glyphicon-exclamation-sign"></i> Ok</div>';
                                                        break;
                                                    case "ALARM":
                                                        html += '<div class="alert alert-danger" role="alert" style="padding:6px; margin: 0;"><i class="glyphicon glyphicon-exclamation-sign"></i> Alarma</div>';
                                                        break;
                                                    case "INSUFFICIENT_DATA":
                                                        html += '<div class="alert alert-warning" role="alert" style="padding:6px; margin: 0;"><i class="glyphicon glyphicon-exclamation-sign"></i> Insuficiente</div>';
                                                        break;
                                                }
                                html +=         '</div>'+
                                            '<div class="col-md-6">'+
                                                '<button type="submit" class="btn btn-default"><i class="glyphicon glyphicon-ok"></i> Guardar Alarma</button>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';

                                billing.append(html);
                                html = "";
                            }
                            Alarms.history(data._response[i]['AlarmName']);
                        }

                        if(cpu.html() == ''){
                            cpu.append('<div class="alert alert-info" role="alert">No existen Alarmas</div>');
                            console.log('No hay Alarmas de CPU');
                        }
                    }
                })

            }
        }).error(function (data){
            $('#stateServices').text('Servicio [Off]');
            console.log('Servicio [Off]');
        });
    },
    refresh: function () {
        Alarms.load();
        setTimeout(function () {
            Alarms.refresh();
            Alarms.history();
        }, 100000);
    },
    history: function(name){
       /* console.log(name);
        var post = { 'AlarmName': name }*/

        // uget({
        //     url: LinkServer.Url('alarm', 'getHistory'),
        //     type: 'POST',
        //     data: post
        // }).done(function (data){
        //     alert('Ok');
        // }).error(function (data){
        //     console.log('No hay historial');
        // });
    }
};

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
                var table = $("#table-alarms");
                
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
                        
                        instance.find(".i_instance").html(tmp.Name);
                    } else {

                        $("#listInstances").append(
                            $('<option/>',{
                                val: tmp.InstanceId,
                                text: tmp.Name
                            })
                        )
                    }
                    
                    Instances.list[tmp.InstanceId] = {
                        Name : tmp.Name
                    };
                }
            }
        }).error(function (data){
            $('#stateServices').text('Servicio [Off]');
            console.log('Servicio [Off]');
        });
    }
};

function showModal(context){
    $('.contex-text').text(context);
    $('#myModal').modal('show');
}

$(function () {
    uget({
        url: LinkServer.Url('user', 'active')
    }).done(function (data) {
        if(data._code !== 200) {
            logout();
        }else{
            AccountId = data._response.idaccount;
        }
    });

    $("#alarms-page").find(".page-header").append(
        $("<a/>", {
            href: '#',
            class: 'btn btn-success',
            html: '<i class="glyphicon glyphicon-dashboard"></i> Crear Alarma'
        }).css({
            position: 'relative',
            float: 'right'
        }).click(function (e) {
            e.preventDefault();
            $('#newAlarmModal').modal('show');
            createNameAlarm();
        })
    );
    
    Alarms.refresh();
    Instances.load();
});


function logout () {
    uget({
        url     : LinkServer.Url('user', 'logout')
    }).done(function (data) {
        location.href = 'index.html';
    });
}

function createAlarm(){
	if($('#newThreshold').val() != ''){
		var op = $('#newSelectAlarm option:selected').val();
	    var ok = "";
	    var alarm = "";
	    var ins = "";

	    switch(op){
	        case "ALARM":
	            alarm = $('#newActionAlarm option:selected').val();
	            break;
	        case "OK":
	            ok = $('#newActionAlarm option:selected').val();
	            break;
	        case "INSUFFICIENT_DATA":
	            ins = $('#newActionAlarm option:selected').val();
	            break;
	    }

	    var post = {
	        'AlarmName': $('#newNameAlarm').val(),
	        'OKActions': ok,
	        'AlarmActions': alarm,
	        'InsufficientDataActions': ins,
	        'MetricName': $('#newMetricName option:selected').val(),
	        'Statistic': $('#newStatistic option:selected').val(),
	        'InstanceId': $('#listInstances option:selected').val(),
	        'Period': $('#newPeriod option:selected').val(),
	        'EvaluationPeriods': $('#newEvaluationPeriods').val(),
	        'Threshold': $('#newThreshold').val(),
	        'ComparisonOperator': $('#newComparisonOperator option:selected').val()
	    }

	    uget({
	        url : LinkServer.Url('alarm', 'add'),
	        type: 'POST',
	        data: post
	    }).done(function (data) {
	        if(data._code === 200) {
	            $('#newThreshold').val('');
	            $('#newAlarmModal').modal('hide');
	            Alarms.refresh();
	            showModal('La alarma fue creada con exito');
	        }else{
	            showModal('La alarma no fue creada.');
	        }
	    });
	}else{
		alert('El campo de porcentaje es requerido');
		$('#newThreshold').focus();
	}
}

function editAlarm(iterator){
    var op = $('#'+ iterator +'SelectAlarm option:selected').val();
    console.log($('#'+ iterator +'SelectAlarm option:selected').val());

    var ok = "";
    var alarm = "";
    var ins = "";

    switch(op){
        case "ALARM":
            alarm = $('#'+ iterator +'ActionAlarm option:selected').val();
            break;
        case "OK":
            ok = $('#'+ iterator +'ActionAlarm option:selected').val();
            break;
        case "INSUFFICIENT_DATA":
            ins = $('#'+ iterator +'ActionAlarm option:selected').val();
            break;
    }

    var post = {
        'AlarmName': $('#'+ iterator +'NameAlarm').val(),
        'OKActions': ok,
        'AlarmActions': alarm,
        'InsufficientDataActions': ins,
        'MetricName': $('#'+ iterator +'MetricName option:selected').val(),
        'Statistic': $('#'+ iterator +'Statistic option:selected').val(),
        'InstanceId': $('#'+ iterator +'Instances').val(),
        'Period': $('#'+ iterator +'Period option:selected').val(),
        'EvaluationPeriods': $('#'+ iterator +'EvaluationPeriods').val(),
        'Threshold': $('#'+ iterator +'Threshold').val(),
        'ComparisonOperator': $('#'+ iterator +'ComparisonOperator option:selected').val()
    }

    uget({
        url : LinkServer.Url('alarm', 'add'),
        type: 'POST',
        data: post
    }).done(function (data) {
        if(data._code === 200) {
            showModal('La alarma fue editada con exito');
        }else{
            showModal('La alarma no editada.');
        }
    });
}

function modalConfirm (context, method, others) {
    $('#myModal .modal-footer').html('<button data-dismiss="modal" type="button" class="btn btn-default">Cancelar</button><button onclick="modalOk(\''+method+'\',\''+others+'\')" type="button" class="btn btn-primary">Aceptar</button>');
    
    showModal(context);
}

function modalOk(method, others){
    console.log( method );
    if(method == 'deleteInstance'){
    	var del = { 'AlarmName': others }
	    uget({
	        url : LinkServer.Url('alarm', 'delete'),
	        type: 'DELETE',
	        data: del
	    }).done(function (data) {
	        Alarms.refresh();
	    });
    }

    $('#myModal').modal('hide');
    restoreModal();
}

function restoreModal(){
	$('#myModal .modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button><button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>');
}

function AlarmDelete (name) {
	modalConfirm('Realmente deseas eliminar esta Alarma?','deleteInstance', name);
}

function createNameAlarm() {
    var str = "";
    var str2 = "";
    var metric = $( "#newMetricName option:selected" ).val();
    var instance = $( "#listInstances option:selected" ).val();
        
    str += "awsec2-" + instance + "-" + metric;
    console.log(str);

    if(metric == 'CPUUtilization'){
        str2 = "Porcentaje:";
    }else if(metric == '' || metric == 'DiskReadBytes' || metric == 'NetworkOut' || metric == 'NetworkIn'){
        str2 = "Bytes:";
    }else if(metric == 'DiskReadOps' || metric == 'DiskWriteBytes'){
        str2 = "Operaciones:";
    }

    $( "#changeLabelForm" ).text( str2 );
    $( "#newNameAlarm" ).val( str );
}

function changeLabelAlarm(iterator) {
    var str2 = "";
    var metric = $( "#" + iterator + "MetricName option:selected" ).val();

    if(metric == 'CPUUtilization'){
        str2 = "Porcentaje:";
    }else if(metric == '' || metric == 'DiskReadBytes' || metric == 'NetworkOut' || metric == 'NetworkIn'){
        str2 = "Bytes:";
    }else if(metric == 'DiskReadOps' || metric == 'DiskWriteBytes'){
        str2 = "Operaciones:";
    }

    $( "#" + iterator + "changeLabelForm" ).text( str2 );
}