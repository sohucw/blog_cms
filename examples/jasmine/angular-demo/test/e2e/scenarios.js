describe('my app', function () {
  beforeEach(function () {
    // Add the custom locator.
    by.addLocator('buttonTextSimple', function (buttonText, optParentElement) {
      // This function will be serialized as a string and will execute in the
      // browser. The first argument is the text for the button. The second
      // argument is the parent element, if any.
      var using = optParentElement || document,
        buttons = using.querySelectorAll('button');

      // Return an array of buttons with the text.
      return Array.prototype.filter.call(buttons, function (button) {
        return button.textContent === buttonText;
      });
    });

    browser.get('../../app/index.html');
  });

  var count = 0;
  it('entering note and performing click', function () {
    var list = element.all(by.repeater('note in notes'));
    list.each(function () {
      count++;
    });
    console.info(count);
    var input = element(by.model('note'));
    input.sendKeys('test data');
    element(by.buttonTextSimple('Add')).click();
  });

  it('should add one more element now', function () {
    var list = element.all(by.repeater('note in notes'));
    expect(list.count()).toBe(count + 1);
    expect(list.last().getText()).toEqual('test data');
  });

});