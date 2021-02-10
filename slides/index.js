// Import React
import React from "react";
import data from "./data.json";
// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  Image,
  Markdown,
  ListItem,
  List,
  Quote,
  Slide,
  Text
} from "spectacle";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Require CSS
require("normalize.css");

const theme = createTheme({
  primary: "white",
  secondary: "#1F2022",
  tertiary: "#03A9FC",
  quaternary: "#CECECE"
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

export default class Presentation extends React.Component {
  render() {
    const additonalSlides = data.map((ex, i) => (<Slide key={i} transition={["fade"]} bgColor="primary">
        <Markdown>{ex.instructions}</Markdown>
    </Slide>));
    return (
      <Deck transition={["zoom", "slide"]} transitionDuration={500} theme={theme}>
        <Slide transition={["zoom"]} bgColor="primary">
            <Image margin="0 auto 100px auto" src="https://assets.breatheco.de/apis/img/images.php?blob&random&cat=icon&tags=breathecode,128" />
            <Heading size={1} fit caps lineHeight={1} textColor="secondary">
                The Command Line Challenge
            </Heading>
            <Text margin="10px 0 0" textColor="tertiary" size={1} fit bold>
                Get to know the coder's best friend
            </Text>
        </Slide>
        <Slide transition={["fade"]} bgColor="tertiary">
          <Heading size={6} textColor="primary" caps>How does it work?</Heading>
          <Heading size={1} textColor="secondary">16 challenges</Heading>
          <Heading size={2} textColor="secondary">12 commands</Heading>
          <Heading size={3} textColor="secondary">1 winner</Heading>
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="tertiary">
          <Heading size={2} textColor="secondary" caps>Rules</Heading>
          <List>
            <ListItem>Each challenge can only have 1 winner.</ListItem>
            <ListItem>Whoever wins the most, wins the prize!</ListItem>
            <ListItem>Only for amateurs (experienced can participate but not win)</ListItem>
            <ListItem>Follow the exact instructions, it can be tricky</ListItem>
            <ListItem>Use the tab shortcut for auto-complete!</ListItem>
          </List>
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="tertiary">
          <Heading size={2} textColor="secondary" caps>Before we start</Heading>
          <Text margin="10px 0 0" textColor="tertiary" size={1} fit>
              Each student must clone the following repository:
          </Text>
          <Text margin="10px 0 0" textColor="secondary" size={1} fit bold>
              https://github.com/breatheco-de/excercise-terminal-challenge.git
          </Text>                    
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="tertiary">
          <Heading size={2} textColor="secondary" caps>Are u ready?</Heading>
        </Slide>
        {additonalSlides}
        <Slide transition={["fade"]} bgColor="secondary" textColor="tertiary">
          <BlockQuote>
            <Quote>Vim is my favourite text editor. I've been using it for years...I can't figure out how to exit.</Quote>
            <Cite>Albert Einstain and Pitagoras</Cite>
          </BlockQuote>
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="tertiary">
          <Heading size={2} textColor="tertiary" caps>THE END</Heading>
        </Slide>
      </Deck>
    );
  }
}
