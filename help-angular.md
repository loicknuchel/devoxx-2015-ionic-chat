# Angular Cheat Sheet

Voici une petite aide sur les concepts d'Angular (et librairies) les plus utiles lors de cet exercice.

### Notions générales

Angular utilise l'injection de dépendences pour l'ensemble de ses composants. Pour utiliser un service (de angular ou que vous avez déclaré), il suffit simplement de le passer en paramètre de votre fonction !

Le `$scope` est l'objet qui fait le lien entre le contrôleur et la vue. Tous les objets ajoutés au `$scope` dans le contrôleur sont accessibles dans la vue et vice versa.

### Routage

Ionic Framework utilise l'excellent [ui-router](https://github.com/angular-ui/ui-router) pour la gestion des routes et des états.

Pour configurer les routes de notre application ui-router nous fourni deux services : `$stateProvider` et `$urlRouterProvider`. Le premier sert à déclarer les routes disponibles et le second à indiquer l'url par défaut à utiliser.

Déclarer les routes se fait dans la partie config d'Angular :

```javascript
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('app', {
        url: '/app',
        templateUrl: 'views/app.html',
        controller: 'AppCtrl'
    });
    $urlRouterProvider.otherwise('/app');
})
```

Ui-router propose plusieurs mécanismes pour changer d'état :

La directive [ui-sref](https://github.com/angular-ui/ui-router/wiki/Quick-Reference#ui-sref) :
```html
<!-- view's code -->
<a ui-sref="home">Go home</a>
<a ui-sref="details({id: 'default'})">Show details</a>
```

Le service [$state](https://github.com/angular-ui/ui-router/wiki/Quick-Reference#state-1) :
```javascript
// controller's code
$state.go('home');
$state.go('details', {id: 'default'});
```


### Contrôlleurs

Les contrôlleurs sont généralement liées à une vue et servent à gérer les données et les actions utilisateurs de la vue à laquelle ils sont rattachés. Un contrôlleur est initialisé à chaque fois qu'il est utilisé avec une vue et détruit lorsque la vue n'est plus utilisée. Le code d'un contrôleur doit rester aussi clair et concis que possible. Pour ce faire, la plupart du code 'métier' doit être packagé dans des services (cf plus bas).

Un contrôlleur se déclare tout simplement avec de fonction `controller(name, function)` de Angular :

```javascript
.controller('AppCtrl', function($scope){
    'user strict';
    // controller code
})
```

Pour des raisons de performances, Ionic Framework ne détruit pas les vues (avec leur contrôlleur) lorsqu'elle ne sont plus utilisées mais les met en cache (en déconnectant le `$scope`). Le contrôlleur est donc initialisé uniquement la première fois qu'il est chargé et non plus à chaque fois que la vue est appelée. Ce qui peut poser des problèmes de raffraichissement de données / libération de ressources. C'est pourquoi Ionic nous fourni des [événements pour contrôler le cycle de vie du contrôlleur](http://ionicframework.com/docs/api/directive/ionView/) :

```javascript
$scope.$on('$ionicView.loaded', function(){
    // The view has loaded. Happen only the first time the controller is loaded.
});
$scope.$on('$ionicView.enter', function(){
    // The view has fully entered and is now the active view.
    // You should do your controller initialization here !
});
$scope.$on('$ionicView.leave', function(){
    // The view has finished leaving and is no longer the active view.
    // You should free resources here (for example socket connexion)
});
$scope.$on('$ionicView.unloaded', function(){
    // The view's controller has been destroyed. Happen only if the view is removed from cache (mostly manually)
});
```

### Directives de vue

Angular propose différentes directives pour contrôler le rendu de la vue en fonction des données du `$scope`. Elles se reconnaissent facilement car elles commencent toutes par `ng-`. Voici les plus utiles pour le projet :

**[ng-repeat](https://docs.angularjs.org/api/ng/directive/ngRepeat)** : permet de répéter un bloc de code pour chaque valeur d'un tableau.
```javascript
// controller's code
$scope.array = ['toto', 'titi', 'tata'];
```
```html
<!-- view's code -->
<div ng-repeat="item in array">
    {{item}}
</div>
```

**[ng-click](https://docs.angularjs.org/api/ng/directive/ngClick)** : permet de déclencher une action lorsque l'on click sur l'élément.
```javascript
// controller's code
$scope.sayHello = function(name){
    alert('Hello '+name);
};
```
```html
<!-- view's code -->
<button ng-click="sayHello('Loïc')">Hello Loïc</button>
```

**[ng-if](https://docs.angularjs.org/api/ng/directive/ngIf)** : permet d'inclure le bloc de HTML uniquement si la valeur de l'expression est `true`.
```javascript
// controller's code
$scope.shouldShow = false;
```
```html
<!-- view's code -->
<div ng-if="shouldShow">I'm not in DOM !</div>
```

**[ng-class](https://docs.angularjs.org/api/ng/directive/ngClass)** : permet d'ajouter une classe dynamiquement.
```javascript
// controller's code
$scope.color = 'blue';
```
```html
<!-- view's code -->
<div ng-class="color">I've class 'blue'</div>
<div ng-class="{red: color==='blue'}">I've class 'red'</div>
<div ng-class="[color, {red: color==='blue'}]">I've class 'blue' and 'red'</div>
```

**[ng-href](https://docs.angularjs.org/api/ng/directive/ngHref)** et **[ng-src](https://docs.angularjs.org/api/ng/directive/ngSrc)** : permettent de créer les attributs `href` et `src` seulement lorsque l'expression Angular est déterminée.
```html
<!-- view's code -->
<a ng-href="http://www.example.com/{{page]}">Link</a>
<img ng-src="{{user.avatar}}">
```

**[ng-model](https://docs.angularjs.org/api/ng/directive/ngModel)** : permet de stocker la valeur d'un champ de formulaire dans le `$scope`
```html
<!-- view's code -->
<input type="text" name="name" ng-model="form.name">
<input type="checkbox" name="agreed" ng-model="form.agreed">
```

**[ng-disabled](https://docs.angularjs.org/api/ng/directive/ngDisabled)** : permet de désactiver un élément (ajout de l'attribut `disabled`) en fonction de la valeur d'une expression
```html
<!-- view's code -->
<button type="submit" ng-disabled="!form.agreed">Valider</button>
```

### Services

Les services sont utiles pour packager une fonctionnalité particulière, créer des objets réutilisables ou mutualiser du code. C'est ici que la plupart du code doit être écrit. Par convention, les services Angular commencent tous par '$' donc il vaut mieux ne pas utiliser ce caractère dans le nom de vos services.

Voici un service basique :

```javascript
.factory('AppSrv', function(){
    'user strict';
    var service = {
        getHelloSentence: getHelloSentence
    };
    
    function getHelloSentence(name){
        return 'Hello '+name;
    }
    
    return service;
})
```

Comme vous pouvez le voir, on utilise la fonction Angular `.factory(name, function)` pour créer notre service. La fonction doit retourner un objet qui sera l'objet que nous récupèrerons en injectant le service. Celui-ci peut contenir des fonctions sans effets de bord (comme dans l'exemple) mais aussi des données ou des fonctions à effet de bord.

Les services étant très multi-tâche (c'est eux qui comportent la plupart du code de l'application), il est conseillé d'adopter des conventions pour les différents types de services.

Voici quelques exemples :

- **NamePlugin** : service permettant de wrapper un plugin cordova
- **NameUtils** : service comportant uniquement des fonctions utilitaires sans effet de bord
- **NameConfig** : service stockant une configuration (statique ou dynamique)
- **NameData** : service stockant dans données (à mutualiser entre plusieurs contrôleurs par exemple)
- **NameStorage** : service permettant de requêter de la donnée vers le stockage local
- **NameBackend** : service permettant de requêter de la donnée vers son backend
- **NameCache** : service de cache
- **NameUI** : service pour manipuler des éléments d'interface
- **NameSrv** : service 'haut-niveau' permettant d'agréger intelligemment plusieurs autres services. *Ex*: `UserSrv` peut dépendre de `UserStorage`, `UserBackend`, `UserCache` et `UserUtils`. Il récupère les utilisateurs en cache puis en local et enfin à distance en fonction des possibilités du moment et les organise/formate comme il faut. C'est le service qui sera utilisé dans les contrôleurs car il masque la complexité de la tâche `getUsers()`.

Bien sûr, toutes ces conventions sont à utiliser judicieusement en fonction du contexte...


### Constantes

Angular permet de définir des constantes qui seront injectables dans les autres partie de l'application, comme un service.

Voici la syntaxe :

```javascript
.constant('Config', {
    url: 'http://myserver.com'
});
```

C'est très pratique pour des configurations globales par exemple !

### Points d'attention

- **Espace de nom global** : tous les modules Angular utilisent un espace de nom global. Attention donc aux télescopages ! Seul le dernier chargé sera conservé !!! Si vous créez deux contrôleurs ou service du même nom, vous risquez de rigoler ! (et le debug n'est pas évident !)
- **Dépendences circulaires** : Angular ne gère pas les dépendences circulaires. Faites donc attention à comment bien découper vos services


Have fun ;)
