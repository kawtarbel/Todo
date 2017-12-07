'use strict';

var myApp = angular.module('myApp', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {   
	$routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    })
    .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
    })
    .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl',
    })
    .when('/users/:id/todos', {
        templateUrl: 'views/todos.html',
        controller: 'TodoCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
myApp.factory('datta', ['$http',  function ($http) {
    return {
        getPosts : () => {
            return $http.get('http://jsonplaceholder.typicode.com/posts');
        },
        getUsers : () => {
            return $http.get('http://jsonplaceholder.typicode.com/users');
        },
        getTodos : () => {
            return $http.get('http://jsonplaceholder.typicode.com/todos');
        },
        getUser : (id) => {
            return $http.get('http://jsonplaceholder.typicode.com/users/'+id);
        }
    }
}]);
myApp.controller('HomeCtrl', ['$scope', function ($scope){
    
}]);
myApp.controller('PostsCtrl', ['$scope', 'datta', function ($scope, datta){
   $scope.posts = [];
    datta.getPosts()
        .then((response) => {
            $scope.posts = response.data;
            //console.log( $scope.posts);
            $scope.users = [];
            datta.getUsers()
                .then((response) => {
                    $scope.users = response.data;

                });

        });
}]);
myApp.controller('UsersCtrl', ['$scope', 'datta', function ($scope, datta){
    datta.getUsers()
    .then((response) => {
        $scope.users = response.data;

    });
}]);
myApp.directive('todo', function() {
    return {
        templateUrl: './views/todo.html',
        controller: ['$scope', '$rootScope', 'datta',function  ($scope, $rootScope, datta){
            if(!$rootScope.todos)
            datta.getTodos()
            .then((res) => {
                $rootScope.todos = res.data;
            })
        }]
    }
});
myApp.controller('TodoCtrl', ['$scope', '$routeParams', 'datta', function ($scope, $routeParams, datta){
    $scope.userId = { userId:  $routeParams.id};
    datta.getUser($scope.userId.userId)
    .then((res) => {
        $scope.user = { name : res.data.name};
    });
}]);