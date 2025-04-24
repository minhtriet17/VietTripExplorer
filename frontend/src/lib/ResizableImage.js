import { Image } from "@tiptap/extension-image";
import 'react-resizable/css/styles.css';

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: element => element.getAttribute("width"),
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
          };
        },
        height: {
          default: "auto",
          parseHTML: (element) => element.getAttribute("height"),
          renderHTML: (attributes) => {
            if (!attributes.height) return {};
            return { height: attributes.height };
          },
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    // Sử dụng ResizableImage trong renderHTML
    return [
      "img",
      {
        ...HTMLAttributes,
        class: "resizable-image", // Đảm bảo có class để dễ dàng target ảnh
      },
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              width: options.width || "auto",
              height: options.height || "auto",
            },
          });
        },
    };
  },
});
