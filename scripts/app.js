(function () {
    'use strict';

    angular.module('localforage.photos', ['angularFileUpload'])
        .controller('PhotosController', PhotosController);

    PhotosController.$inject = ['$q'];

    function PhotosController($q) {
        var vm = this;

        vm.newPhoto = {};
        vm.savedPhotos = [];
        vm.driver = localforage.driver();
        vm.savePhoto = savePhoto;

        displayImages();

        function savePhoto() {
            var reader = new FileReader();
            var file = vm.newPhoto.files[0];

            reader.onload = function (readerEvt) {
                var base64Photo = btoa(readerEvt.target.result);
                
                var key = 'photo-' + (new Date()).getTime();
                var photo = {
                    id: key,
                    photo: base64Photo,
                    name: file.name,
                    type: file.type
                };

                $q.when(localforage.setItem(key, photo)).then(function () {
                    alert('saved');
                    vm.newPhoto = {};
                    displayImages();
                }).catch(function (err) {
                    console.log(err);
                })
            };

            reader.readAsBinaryString(file);
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
    }

}());
