editor.directive('editorToolbar', function() {
    return {
        restrict: 'E',
        template:
        '<div class="action-group" ng-repeat="group in actionGroups">\n' +
        '    <button ng-repeat-start="action in group.actions" ng-if="::action.display === \'button\'" ng-click="invokeAction(action)" class="action {{::action.class}}" title="{{::action.title}}" ng-disabled="showCode && !action.enabled"></button>\n' +
        '    <editor-dropdown ng-if="::action.display === \'dropdown\'" class="action {{::action.class}}" title="{{::action.title}}" disabled="showCode && !action.enabled"></editor-dropdown>\n' +
        '    <div ng-repeat-end ng-if="::action.display === \'div\'" class="action {::action.class}}">\n' +
        '        {{action.content}}\n' +
        '    </div>\n' +
        '</div>'
    }
});