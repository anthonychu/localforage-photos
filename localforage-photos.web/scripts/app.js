(function () {
    'use strict';

    angular.module('localforage.photos', ['angularFileUpload'])
        .controller('PhotosController', PhotosController);

    PhotosController.$inject = ['$q'];

    function PhotosController($q) {
        var vm = this;

        vm.newPhoto = {};
        vm.savedPhotos = [];
        vm.savePhoto = savePhoto;
        vm.deletePhoto = deletePhoto;
        vm.getCurrentStorageMode = getCurrentStorageMode;

        displayImages();

        function savePhoto() {
            var reader = new FileReader();
            var caption = vm.newPhoto.caption;
            var file = vm.newPhoto.files[0];

            reader.onload = function (readerEvt) {
                var base64Photo = btoa(readerEvt.target.result);
                
                var key = 'photo-' + (new Date()).getTime();
                var photo = {
                    id: key,
                    photo: base64Photo,
                    name: file.name,
                    type: file.type,
                    caption: caption
                };

                $q.when(localforage.setItem(key, photo)).then(function () {
                    alert('saved');
                    vm.newPhoto = {};
                    vm.savedPhotos.push(photo);
                }).catch(function (err) {
                    alert(err);
                })
            };

            reader.readAsBinaryString(file);
        }

        function deletePhoto(photo) {
            $q.when(localforage.removeItem(photo.id)).then(function () {
                var foundIdx = -1;
                angular.forEach(vm.savedPhotos, function (value, idx) {
                    foundIdx = idx;
                });
                if (foundIdx >= 0) {
                    vm.savedPhotos.splice(foundIdx, 1);
                }
            }, function (err) {
                alert(err);
            });
        }

        function displayImages() {
            vm.savedPhotos = [];
            $q.when(localforage.keys()).then(function (keys) {
                angular.forEach(keys, function (key) {
                    $q.when(localforage.getItem(key)).then(function (item) {
                        vm.savedPhotos.push(item);
                    });
                });
            });
        }

        function getCurrentStorageMode() {
            switch (localforage.driver()) {
                case localforage.INDEXEDDB:
                    return "IndexedDb";
                case localforage.WEBSQL:
                    return "WebSQL";
                default:
                    return "LocalStorage";
            }
        }
    }

}());
