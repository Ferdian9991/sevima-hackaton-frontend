import React, { Component } from "react";
import tw, { css } from "twin.macro";

class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  show = () => {
    this.setState({
      visible: true,
    });
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <div
        tw="fixed block w-[100%] h-[100%] top-0 bottom-0 left-0 right-0 cursor-pointer"
        css={{
          visibility: visible ? "visible" : "hidden",
          opacity: visible ? 1 : 0,
          "-webkit-transition":
            "visibility 0s linear 200ms, opacity 200ms linear",
          "background-color": `rgba(
                243,
                243,
                243,
                0.4
              )`,
          "z-index": "9997",
        }}
      >
        <div
          tw="absolute top-0 bottom-0 left-0 right-0 m-auto w-[50px] h-[50px] animate-spin"
          css={{
            border: "4px solid #ddd",
            "border-top": "4px solid #0984e3",
            "border-radius": "50%",
          }}
        />
      </div>
    );
  }
}

export default LoadingSpinner;
