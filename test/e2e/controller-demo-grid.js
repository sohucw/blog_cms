'use strict';

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
        return button.textContent.trim() === buttonText;
      });
    });
    browser.get('examples/grid');
  });

  var count = 0;

  it('测试新建功能，点击新建按钮', function () {
    // 以下计算count代码必须写在 it 里面，不能写在外面，否则由于是异步计算会报错
    var list = element.all(by.repeater('item in items'));
    list.each(function () {
      count++;
    });
    element(by.buttonTextSimple('新建')).click();

    // Find by model.
    var titleInput = element(by.model('demo.title'));
    titleInput.sendKeys('title1');
    expect(titleInput.getAttribute('value')).toBe('title1');

    //var contentText = element(by.model('demo.content'));
    //contentText.sendKeys('content1');
    //expect(contentText.getAttribute('value')).toBe('content1');

    element(by.buttonTextSimple('OK')).click();
  });

  it('记录总数应该增加一条', function () {
    var list = element.all(by.repeater('item in items'));
    count++;
    expect(list.count()).toBe(count);
  });

  it('测试编辑功能，点击编辑按钮', function () {
    element(by.css('.glyphicon-pencil')).click();

    // Find by model.
    var titleInput = element(by.model('demo.title'));
    var oValue;
    titleInput.getAttribute('value').then(function (value) {
      oValue = value;
      titleInput.sendKeys('update_title1');
      expect(titleInput.getAttribute('value')).toBe(oValue + 'update_title1');
    });

    //var contentText = element(by.model('demo.content'));
    //contentText.getAttribute('value').then(function (value) {
    //  oValue = value;
    //  contentText.sendKeys('update_content1');
    //  expect(contentText.getAttribute('value')).toBe(oValue + 'update_content1');
    //});

    element(by.buttonTextSimple('OK')).click();

    var list = element.all(by.repeater('item in items'));
    expect(list.count()).toBe(count);
  });

  it('测试删除一条记录功能，点击删除一条记录按钮', function () {
    element(by.css('.glyphicon-trash')).click();
    element(by.buttonTextSimple('确定')).click();

    var list = element.all(by.repeater('item in items'));
    count--;
    expect(list.count()).toBe(count);
  });

  it('测试删除多条记录功能，点击删除按钮', function () {
    element(by.model('grid.checked')).click();
    element(by.buttonTextSimple('删除')).click();
    element(by.buttonTextSimple('确定')).click();

    var list = element.all(by.repeater('item in items'));
    count = 0;
    expect(list.count()).toBe(count);
  });
});
