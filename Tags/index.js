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
      text: props.initialText
    };
  };

  showLastTag = () => {
    let newTags = [...this.props.tagsValue]
    newTags = newTags.slice(0, -1)
    this.setState(state =>
    ({
      text: newTags.slice(-1)[0] || undefined
    }),
      () =>
        this.props.onChangeTags && this.props.onChangeTags(newTags)
    );
  };

  addTag = text => {
    let newTags = [...this.props.tagsValue]
    newTags = [...newTags, text.trim()]
    this.setState(state =>
    ({
      text: undefined
    }),
      () => this.props.onChangeTags && this.props.onChangeTags(newTags)
    );
  };

  onChangeText = text => {
    let newTags = [...this.props.tagsValue]
    if (text.length === undefined) {
      this.showLastTag();
    } else if (
      text.length > 1 &&
      this.props.createTagOnString.includes(text.slice(-1)) &&
      !text.match(new RegExp(`^[${this.props.createTagOnString.join("")}]+$`, 'g')) &&
      !(this.props.tagsValue.indexOf(text.slice(0, -1).trim()) > -1)
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
      renderTag,
      tagListStyle
    } = this.props;

    return (
      <View style={[styles.container, containerStyle, style]}>
        <FlatList
          numColumns={maxNumberOfTags}
          columnWrapperStyle={{ flexWrap: 'wrap', margin: 2 }}
          horizontal={false}
          showsVerticalScrollIndicator={true}
          style={[styles.scrollContainer, style, tagListStyle]}
          data={this.props.tagsValue}
          renderItem={({ item, index }) => {
            const tagProps = {
              tag: item,
              index,
              deleteTagOnPress,
              onPress: event => {
                event?.persist();
                let newTags = [...this.props.tagsValue]
                if (deleteTagOnPress && !readonly) {
                  newTags = [...this.props.tagsValue.slice(0, index), ...this.props.tagsValue.slice(index + 1)]
                  this.props.onChangeTags && this.props.onChangeTags(newTags);
                  onTagPress && onTagPress(index, item, event, true);
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
          && maxNumberOfTags > this.props.tagsValue.length
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
