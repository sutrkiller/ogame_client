import * as React from 'react';
import {CSSTransition} from "react-transition-group";

export const SlideAnimation = ({children, ...props}: any) => {
  return (
    <CSSTransition
      {...props}
      timeout={800}
      classNames="notification-animation"
    >
      {children}
    </CSSTransition>
  )
};
