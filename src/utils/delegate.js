function Delegate() {

}

/**
 * @description
 * <p>Source:
 * <a href="http://stackoverflow.com/questions/520019/controlling-the-value-of-this-in-a-jquery-event">
 *     Stackoverflow
 * </a></p>
 *
 * @param {Object} scope The scope which you want to apply.
 * @return {Function} function with maintained scope
 */
Delegate.create = function(scope, method) 
{
    return function() {
        // Forward to the original function using 'scope' as 'this'.
        return method.apply(scope, arguments);
    };
};