## WYSIWYG HTML Editor using AngularJS

We are going to be working with two different representations of the content.

1. The source code.  This will be viewable in a "code" view of the editor.
2. The "What you see" HTML.

### Editor Breakdown

- `contenteditable` div
  - Allows for user to type text (and it will be input into the HTML)
  - Allows for user to undo/redo type actions
  - Handles backspace and delete
  - Handles line breaks perfectly - creates new paragraph element
  - Handle shift+enter to creat <br> perfectly
- A set of tools/actions that can be used to modify content
  - E.g.
    - Bold
    - Italic
    - Underline
    - Blah blah blah !
  - I want to implement this with an API
    - This is so other developers using the library can add additional toolbar items
  - Potential challenge: When the user clicks a toolbar button, do we lose track of what text was focused in the editor?
    - Simple solution: just cache the selected text?
  - A list of styles
    - Library users should be able to access an API to add new styles to the styles dropdown
- TODO: Decide on implementation for
  - Header ids
  - target="_blank" on links

  
### Directive blocks
I want to be able to use AngularJS Directives (a subset, at least) within the HTML content of the WYSIWYG editor. These directives should be able to be displayed in a WYSIWYG format, but we need to be able to handle transclusion.

---

