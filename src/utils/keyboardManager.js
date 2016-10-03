function KeyboardManager()
{
    this.keyMap = {};

    document.body.onkeydown = Delegate.create(this, this.addKeyToMap);
    document.body.onkeyup = Delegate.create(this, this.removeKeyFromMap);
}

KeyboardManager.LEFT_KEY= 'k37';
KeyboardManager.UP_KEY = 'k38';
KeyboardManager.RIGHT_KEY = 'k39';
KeyboardManager.DOWN_KEY = 'k40';
KeyboardManager.A_KEY = 'k65';

KeyboardManager.prototype.addKeyToMap = function(e) 
{
    var key = e.keyCode;
    this.keyMap['k'+key] = true;
};

KeyboardManager.prototype.removeKeyFromMap = function(e) 
{
    var key = e.keyCode;
    if (this.keyMap['k'+key]) {
       this.keyMap['k'+key] = null;
    }
};

KeyboardManager.prototype.isKeyPressed = function( key )
{
    return this.keyMap[key];
};