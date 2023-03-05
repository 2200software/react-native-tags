import React from "react";
import PropTypes from "prop-types";
import { FlatList, View } from "react-native";

import Tag from "./Tag";
import Input from "./Input";
import styles from "./styles";

class Tags extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: props.initialTags,
      text: props.initialText
    };
  };

  showLastTag = () => {
    this.setState(state =>
    ({
      tags: state.tags.slice(0, -1),
      text: state.tags.slice(-1)[0] || undefined
    }),
      () =>
        this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
    );
  };

  addTag = text => {
    this.setState(state =>
    ({
      tags: [...state.tags, text.trim()],
      text: undefined
    }),
      () => this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
    );
  };

  onChangeText = text => {
    if (text.length === undefined) {
      this.showLastTag();
    } else if (
      text.length > 1 &&
      this.props.createTagOnString.includes(text.slice(-1)) &&
      !text.match(new RegExp(`^[${this.props.createTagOnString.join("")}]+$`, 'g')) &&
      !(this.state.tags.indexOf(text.slice(0, -1).trim()) > -1)
    ) {
      this.addTag(text.slice(0, -1));
    } else {
      this.setState({ text });
    }
  };

  onSubmitEditing = () => {
    if (!this.props.createTagOnReturn) {
      return;
    }
    this.addTag(this.state.text);
  };

  render() {

    const {
      containerStyle,
      style,
      readonly,
      maxNumberOfTags,
      tagContainerStyle,
      tagTextStyle,
      deleteTagOnPress,
      onTagPress,
      renderTag
    } = this.props;

    return (
      <View style={[styles.container, containerStyle, style]}>
        <FlatList
          numColumns={maxNumberOfTags}
          columnWrapperStyle={{ flexWrap: 'wrap', margin: 2 }}
          horizontal={false}
          showsVerticalScrollIndicator={true}
          style={[styles.scrollContainer, style]}
          data={this.state.tags}
          renderItem={({ item, index }) => {
            const tagProps = {
              tag: item,
              index,
              deleteTagOnPress,
              onPress: event => {
                event?.persist();
                if (deleteTagOnPress && !readonly) {
                  this.setState(state =>
                  ({
                    tags: [
                      ...state.tags.slice(0, index),
                      ...state.tags.slice(index + 1)
                    ]
                  }),
                    () => {
                      this.props.onChangeTags &&
                        this.props.onChangeTags(this.state.tags);
                      onTagPress && onTagPress(index, item, event, true);
                    }
                  );
                } else {
                  onTagPress && onTagPress(index, item, event, false);
                }
              },
              tagContainerStyle,
              tagTextStyle
            };
            return renderTag(tagProps);
          }}
        />

        {!readonly
          && maxNumberOfTags > this.state.tags.length
          &&
          <Input
            value={this.state.text}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitEditing}
            {...this.props}
          />
        }

      </View>
    );
  };

}

Tags.defaultProps = {
  initialTags: [],
  initialText: undefined,
  createTagOnString: [",", " "],
  createTagOnReturn: false,
  readonly: false,
  deleteTagOnPress: true,
  maxNumberOfTags: Number.POSITIVE_INFINITY,
  renderTag: ({ tag, index, ...rest }) => (
    <Tag key={`${tag}-${index}`} label={tag} {...rest} />
  )
};

Tags.propTypes = {
  initialText: PropTypes.string,
  initialTags: PropTypes.arrayOf(PropTypes.string),
  createTagOnString: PropTypes.array,
  createTagOnReturn: PropTypes.bool,
  onChangeTags: PropTypes.func,
  readonly: PropTypes.bool,
  maxNumberOfTags: PropTypes.number,
  deleteTagOnPress: PropTypes.bool,
  renderTag: PropTypes.func,
  /* style props */
  containerStyle: PropTypes.any,
  style: PropTypes.any,
  inputContainerStyle: PropTypes.any,
  inputStyle: PropTypes.any,
  tagContainerStyle: PropTypes.any,
  tagTextStyle: PropTypes.any,
  textInputProps: PropTypes.object
};

export { Tags };
export default Tags;
