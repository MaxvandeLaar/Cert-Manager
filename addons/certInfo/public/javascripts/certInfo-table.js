import moment from 'moment';

export default class CertInfoTable {

    constructor(selector, options){
        let opts = Object.assign( {
            dom: 'Blfrtip',
            buttons: [
                'copy', 'excel', 'pdf'
            ],
            colReorder: true,
            fixedHeader: true,
            responsive: {
                breakpoints: [
                    {name: 'bigdesktop', width: Infinity},
                    {name: 'meddesktop', width: 1480},
                    {name: 'smalldesktop', width: 1280},
                    {name: 'medium', width: 1188},
                    {name: 'tabletl', width: 1024},
                    {name: 'btwtabllandp', width: 848},
                    {name: 'tabletp', width: 768},
                    {name: 'mobilel', width: 480},
                    {name: 'mobilep', width: 320}
                ]
            }
        } , options);
        console.log(opts);
        this.dataTable = $(selector).DataTable(opts);
    }

    addRow(data){
        this.dataTable.row.add([
            data.commonName,
            moment(data.validity.end).format('DD/MM/YY HH:mm'),
            data.organization,
            data.emailAddress,
            data.locality,
            data.state,
            data.country,
            data.issuer.organization
        ]).draw(false);
        $(window).trigger('resize');
    }
}