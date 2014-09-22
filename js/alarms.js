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

                                var tempDiv = "";
                                var tempText = "";

                                switch(data._response[i].StateValue){
                                    case "OK":
                                        tempDiv += 'list-group-item list-group-item-success';
                                        tempText += '<span style="padding:2px; margin:0; float:right; margin-top:-3px;"><i class="glyphicon glyphicon-exclamation-sign"></i> Ok</span>';
                                        break;
                                    case "ALARM":
                                        tempDiv += 'list-group-item list-group-item-danger';
                                        tempText += '<span style="padding:2px; margin:0; float:right; margin-top:-3px;"><i class="glyphicon glyphicon-exclamation-sign"></i> Alarma</span>';
                                        break;
                                    case "INSUFFICIENT_DATA":
                                        tempDiv += 'list-group-item list-group-item-warning';
                                        tempText += '<span style="padding:2px; margin:0; float:right; margin-top:-3px;"><i class="glyphicon glyphicon-exclamation-sign"></i> Insuficiente</span>';
                                        break;
                                }

                                html = '<div class="' + tempDiv +'">'+
                                            '<h4 class="panel-title">'+
                                                tempText +
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
                                                '<option value="Sum">Total</option>';
                                        break;
                                    case "Minimum":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option selected value="Minimum">Minimo</option>'+
                                                '<option value="Maximum">Maximo</option>'+
                                                '<option value="Sum">Total</option>';
                                        break;
                                    case "Maximum":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option value="Minimum">Minimo</option>'+
                                                '<option selected value="Maximum">Maximo</option>'+
                                                '<option value="Sum">Total</option>';
                                        break;
                                    case "Sum":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option value="Minimum">Minimo</option>'+
                                                '<option value="Maximum">Maximo</option>'+
                                                '<option selected value="Sum">Total</option>';
                                        break;
                                    case "SampleCount":
                                        html += '<option value="Average">Promedio</option>'+
                                                '<option value="Minimum">Minimo</option>'+
                                                '<option value="Maximum">Maximo</option>'+
                                                '<option value="Sum">Total</option>';
                                        break;
                                }
                                                   
                                html +=         '</select>'+
                                            '</div>'+
                                            '<div class="col-md-6">'+
                                                '<label>De:</label>'+
                                                '<select id="'+ i +'MetricName" onchange="changeLabelAlarm(\'' + i + '\')" class="form-control">';

                                switch(data._response[i]['MetricName']){
                                    case "CPUUtilization":
                                        html += '<option selected value="CPUUtilization">Consumo de CPU</option>';
                                        break;
                                    // case "NetworkOut":
                                    //     html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                    //             '<option selected value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                    //             '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                    //             '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                    //             '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                    //             '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                    //     break;
                                    // case "DiskReadBytes":
                                    //     html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                    //             '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                    //             '<option selected value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                    //             '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                    //             '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                    //             '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                    //     break;
                                    // case "DiskReadOps":
                                    //     html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                    //             '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                    //             '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                    //             '<option selected value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                    //             '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                    //             '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                    //     break;
                                    // case "DiskWriteBytes":
                                    //     html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                    //             '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                    //             '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                    //             '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                    //             '<option selected value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                    //             '<option value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                    //     break;
                                    // case "NetworkIn":
                                    //     html += '<option value="CPUUtilization">Consumo de CPU</option>'+
                                    //             '<option value="NetworkOut">Transferencia de Datos de Salida</option>'+
                                    //             '<option value="DiskReadBytes">Operaciones Lectura Disco en Bytes</option>'+
                                    //             '<option value="DiskReadOps">Operaciones Lectura Disco</option>'+
                                    //             '<option value="DiskWriteBytes">Operaciones Escritura Disco en Bytes</option>'+
                                    //             '<option selected value="NetworkIn">Transferencia de Datos de Entrada</option>';
                                    //     break;
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
                                                '<label>Con la condición de que:</label>'+
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
                                                '<label id="'+ i +'changeLabelForm">Porcentaje (%):</label>'+
                                                '<input id="'+ i +'Threshold" class="form-control" type="text" value="'+ data._response[i]['Threshold'].substring(0,data._response[i]['Threshold'].length-2) +'">'+
                                            '</div>'+
                                        '</div>'+  
                                    '</div>'+
                                    '<div class="form-group">'+
                                        '<div class="row">'+
                                            '<div class="col-md-6">'+
                                                '<label>Durante por lo menos (Ciclos):</label><br>'+
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
                                                '<label>Realice la acción de:</label>'+
                                                '<fieldset id="changeCombox">'+
                                                    '<select id="'+ i +'ActionAlarm" class="form-control">';

                                if(data._response[i]['OKActions'][0] != null){
                                    switch(data._response[i]['OKActions'][0]){
                                        case "arn:aws:automate:us-east-1:ec2:stop":
                                            html += '<option selected value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        // case "arn:aws:automate:us-east-1:ec2:terminate":
                                        //     html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                        //             '<option selected value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                        //             '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                        //     break;
                                        default:
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option selected value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                    }
                                }

                                if(data._response[i]['AlarmActions'][0] != null){
                                    switch(data._response[i]['AlarmActions'][0]){
                                        case "arn:aws:automate:us-east-1:ec2:stop":
                                            html += '<option selected value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        // case "arn:aws:automate:us-east-1:ec2:terminate":
                                        //     html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                        //             '<option selected value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                        //             '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                        //     break;
                                        default:
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option selected value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                    }
                                }

                                if(data._response[i]['InsufficientDataActions'][0] != null){
                                    switch(data._response[i]['InsufficientDataActions'][0]){
                                        case "arn:aws:automate:us-east-1:ec2:stop":
                                            html += '<option selected value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                        // case "arn:aws:automate:us-east-1:ec2:terminate":
                                        //     html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                        //             '<option selected value="arn:aws:automate:us-east-1:ec2:terminate">Terminar la instacia</option>'+
                                        //             '<option value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                        //     break;
                                        default:
                                            html += '<option value="arn:aws:automate:us-east-1:ec2:stop">Detener la instacia</option>'+
                                                    '<option selected value="arn:aws:sns:us-east-1:'+ AccountId +':NotifyMe">Notificarme</option>';
                                            break;
                                    }
                                }
                                                       
                                html +=             '</select>'+
                                                '</fieldset>'+
                                            '</div>'+
                                            '<div class="col-md-6">'+
                                                '<label>Cuando este en estado de:</label>'+
                                                '<select id="'+ i +'SelectAlarm" class="form-control">';

                                if(data._response[i]['OKActions'][0] != null){
                                    html += '<option value="ALARM">Estado de Alarma</option>'+
                                            '<option selected value="OK">Estado Ok</option>';
                                }else if(data._response[i]['AlarmActions'][0] != null){
                                    html += '<option selected value="ALARM">Estado de Alarma</option>'+
                                            '<option value="OK">Estado Ok</option>';
                                }else if(data._response[i]['InsufficientDataActions'][0] != null){
                                    html += '<option value="ALARM">Estado de Alarma</option>'+
                                            '<option value="OK">Estado Ok</option>';
                                }

                                html +=        '</select>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="form-group">';

                                html += '<label>En el servidor de:</label> ' + tempInstanceName +
                                        '<input type="hidden" id="'+ i +'Instances" value="' + data._response[i]['Dimensions'][0].Value + '">' +
                                    '</div>'+
                                    '<div class="form-group">'+
                                        '<label>Nombre de Alarma: </label> <span id="'+ i +'NameAlarm">' + data._response[i]['AlarmName'] + '</span>'+
                                    '</div><hr>'+
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

                                html += '<div class="well col-md-5" style="margin-left:2%;">'+
                                            '<h4>Historial</h4>'+
                                            '<div id="history'+ i +'">'+
                                                '<ul class="timeline">'+
                                                    '<li>'+
                                                        '<div class="timeline-badge warning">'+
                                                            '<i class="fa fa-check"></i>'+
                                                        '</div>'+
                                                        '<div class="timeline-panel">'+
                                                            '<div class="timeline-heading">'+
                                                                '<h4 class="timeline-title">Lorem ipsum dolor</h4>'+
                                                                '<p>'+
                                                                    '<small class="text-muted">'+
                                                                        '<i class="fa fa-check"></i> 11 hours ago via Twitter'+
                                                                    '</small>'+
                                                                '</p>'+
                                                            '</div>'+
                                                            '<div class="timeline-body">'+
                                                                '<p>Lorem ipsum dolor sit amet</p>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</li>'+
                                                    '<li class="timeline-inverted">'+
                                                        '<div class="timeline-badge warning">'+
                                                            '<i class="fa fa-check"></i>'+
                                                        '</div>'+
                                                        '<div class="timeline-panel">'+
                                                            '<div class="timeline-heading">'+
                                                                '<h4 class="timeline-title">Lorem ipsum dolor</h4>'+
                                                                '<p>'+
                                                                    '<small class="text-muted">'+
                                                                        '<i class="fa fa-check"></i> 11 hours ago via Twitter'+
                                                                    '</small>'+
                                                                '</p>'+
                                                            '</div>'+
                                                            '<div class="timeline-body">'+
                                                                '<p>Lorem ipsum dolor sit amet.</p>'+
                                                                '<p>Lorem ipsum dolor sit amet.</p>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</li>'+
                                                '</ul>'+
                                            '</div>'+
                                        '</div>';   
                                html += "</div></div>";

                                cpu.append(html);
                                html = "";

                                changeLabelAlarm(i);

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
        setTimeout(function(){
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

$(function () {
    uget({
        url: LinkServer.Url('user', 'active')
    }).done(function (data) {
        if(data._code !== 200) {
            logout();
        }else{
            $('#userName').text(data._response['user']);
            AccountId = data._response.idaccount;
        }
    });

    uget({
        url: LinkServer.Url('sns', 'get')
    }).done(function (data) {
        var sw = 'block';
        var sw2 = 'none';

        if(data._code === 200) {
            $('#stateServices').text('Servicio [On]');
            var listEmails = data._response;
            if(listEmails.length >= 1){
                for (var i = 0; i < listEmails.length; i++){
                    if(listEmails[i]['SubscriptionArn'] === 'Deleted' || listEmails[i]['SubscriptionArn'] === 'PendingConfirmation'){
                        sw = 'none';
                        sw2 = 'block';
                    }
                }
            }else{
                sw = 'none';
                sw2 = 'block';
            }
        }

        if(sw === 'none'){ createSnsMessage(); }
        else{
            Alarms.refresh();
            Instances.load();            
        }
        $('#alarms-page').css({'display': sw});
        $('#sns').css({'display': sw2});
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
            setTimeout(function(){
                $('#newAlarmModal').find("[id=newThreshold]").focus();
                console.log('setTimeout');
            }, 500);
        })
    );
});

function createSnsMessage(){
    $('#sns').append(
        $('<div/>', {
            class: 'row'
        }).append(
            $('<div/>', {
                class: 'col-lg-12'
            }).append(
                $('<h1/>', {
                    class: 'page-header',
                    text: 'Configuracion de Alarmas'
                })
            )
        ).append(
            $('<div/>', {
                class: 'row'
            }).append(
                $('<div/>', {
                    class: 'col-lg-12'
                }).append(
                    $('<div/>', {
                        class: 'alert alert-info text-center col-md-6 center-block',
                        role: 'alert'
                    }).css({
                        float: 'none'
                    }).append(
                        $('<p/>').html(
                            'Para poder activar sus Alarmas, debe configurar su correo a donde desea recibir todas las notificaciones de las Alarmas. Para configurar su correo haga click <a href="settings.html"><strong>Aqui!</strong></a> y se dirige a la seccion de <strong>correos para Alarmas</strong>.'
                        )
                    )
                )
            )
        )
    );
}

function logout () {
    uget({
        url     : LinkServer.Url('user', 'logout')
    }).done(function (data) {
        location.href = 'index.html';
    });
}

function valideAlarm(){
    var error = 0;
    var field = 0;

    if($('#newThreshold').val() == ''){ error = 1; field = $('#newThreshold'); }
    if($('#newEvaluationPeriods').val() == ''){ error = 1; field = $('#newEvaluationPeriods'); }
    if($('#newNameAlarm').val() == ''){ error = 1; field = $('#newNameAlarm'); }

	if(error == 1){
        alert('Todos los campos son requeridos.');
		field.focus();
    }else{
        var metric = $('#newMetricName option:selected').val();
        if(metric == 'CPUUtilization'){
            var porc = parseInt($('#newThreshold').val());
            if(porc < 1){
                alert('El porcentaje no debe ser menor al 1%');
                $('#newThreshold').focus();
                return;
            }else if(porc > 100){
                alert('El porcentaje no debe ser mayor al 100%');
                $('#newThreshold').focus();
                return;
            }            
        }
        
        createAlarm();
    }
}

function createAlarm(){
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
            showModal('La alarma fue creada con exito.');
        }else{
            showModal('La alarma no fue creada.');
        }
    });
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
        'AlarmName': $('#'+ iterator +'NameAlarm').text(),
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

function AlarmDelete (name) {
    var footer = $("<div/>");

    $("<button/>",{
        class: 'btn btn-default',
        'data-dismiss': 'modal',
        type: 'button'
    }).html("Cancelar").appendTo(footer);

    $("<button/>",{
        class: 'btn btn-danger',
        type: 'button'
    }).html('<i class="glyphicon glyphicon-trash"></i> Eliminar')
    .click(function (e){
        var del = { 'AlarmName': name }
        uget({
            url : LinkServer.Url('alarm', 'delete'),
            type: 'DELETE',
            data: del
        }).done(function (data) {
            Alarms.refresh();
        });
        $('#myModal').modal('hide');
    }).appendTo(footer);

    $('#myModal .modal-title').html('Console - Soluntech');
    $('#myModal .modal-footer').html(footer);
    $('#myModal .contex-text').text('Realmente deseas eliminar esta Alarma?');
    $('#myModal').modal('show');
}

function createNameAlarm() {
    var str = "";
    var str2 = "";
    var metric = $( "#newMetricName option:selected" ).val();
    var instance = $( "#listInstances option:selected" ).val();
        
    str += "awsec2-" + instance + "-" + metric;
    console.log(str);

    if(metric == 'CPUUtilization'){
        str2 = "Porcentaje (%):";
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
        str2 = "Porcentaje (%):";
    }else if(metric == '' || metric == 'DiskReadBytes' || metric == 'NetworkOut' || metric == 'NetworkIn'){
        str2 = "Bytes:";
    }else if(metric == 'DiskReadOps' || metric == 'DiskWriteBytes'){
        str2 = "Operaciones:";
    }

    $( "#" + iterator + "changeLabelForm" ).text( str2 );
}