Dropzone.autoDiscover = false;
import DropZone from './dropzone-custom';
import CertInfoTable from './certInfo-table';
import '@fortawesome/fontawesome-free/js/all';

$(() => {
    const passwordField = $("#password");
    const url = $("#file-uploader").attr('data-url');
    const dropzone = DropZone('#file-uploader', uploadSuccess, {url: url});

    dropzone.on("sending", function(file, xhr, formData) {
        formData.append("password", passwordField.val());
    });

    const infoTable = new CertInfoTable("#info-table");

    $("#toggle-password").click((e) => {
        const type = passwordField.attr('type');
        if (type.toLowerCase() === "text"){
            passwordField.prop('type', 'password');
            $("#eye-hide").hide();
            $("#eye-show").show();
        } else {
            passwordField.prop('type', 'text');
            $("#eye-show").hide();
            $("#eye-hide").show();
        }
    });

    function uploadSuccess(file, response){
        if (!response || !response.commonName){
            return;
        }

        infoTable.addRow(response);
        passwordField.val("");
    }
});
