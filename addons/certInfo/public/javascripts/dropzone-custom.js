/*******************************************************************************
 * Author:  Max van de Laar
 *
 * Copyright (c) 2018.
 ******************************************************************************/


Dropzone.autoDiscover = false;

/**
 *
 * @param elem
 * @param successCallback
 * @param opts
 * @constructor
 */
export default function DropZone(elem, successCallback, opts = {}) {
    const template = `
        <div class="card dz-preview dz-file-preview">
            <img class="card-img-top" data-dz-thumbnail>
            <ul class="list-group list-group-flush">
                <li class="list-group-item text-center"><h6 class="card-subtitle mb-2 text-muted"><span data-dz-name></span></h6></li>
                <li class="list-group-item text-center"><p class="card-text"><span data-dz-size></span></p></li>              
                <li class="list-group-item text-center">
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                </li>
                <li class="list-group-item text-center">
                    <a class="btn btn-warning" role="button" data-dz-remove>${opts.dictRemoveFile? opts.dictRemoveFile: 'Remove file'}</a>
                </li>
                <li class="list-group-item">
                    <p class="card-text dz-error-mark small text-center"><i class="fas fa-exclamation-triangle text-danger"></i> <span class="text-danger" data-dz-errormessage></span></p>
                </li>
            </ul>
        </div>`;

    const defaultOpts = {
        url: '/',
        uploadMultiple: false,
        autoProcessQueue: true,
        success: successCallback,
        error: function(file, error, xhr){
            console.log(file);
            console.error(error);
        }
    };

    const options = Object.assign(defaultOpts, opts);

    const dropzone = new Dropzone(elem, options);

    // Not working IE & Safari FIX: https://github.com/enyo/dropzone/issues/1640
    dropzone.handleFiles = function(files) {
        let _this5 = this;
        let files_array = [];

        for (let i = 0; i < files.length; i++) {
            files_array.push(files[i]);
        }

        return files_array.map(function(file) {
            return _this5.addFile(file);
        });
    };

    return dropzone;
}
