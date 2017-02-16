import { NGFirebaseChatPage } from './app.po';

describe('ngfirebase-chat App', function() {
  let page: NGFirebaseChatPage;

  beforeEach(() => {
    page = new NGFirebaseChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
