import * as React from 'react';
import ReactTags, { Tag } from 'react-tag-autocomplete';

interface TagsState {
    tags: Tag[];
    suggestions: Tag[];
}

interface selectedTagsParams {
    tags?: number[];
}



export default class Tags extends React.Component<selectedTagsParams, TagsState> {

    constructor(props: selectedTagsParams) {
        super(props);
        this.state = {
            tags: [],
            suggestions: [
                { id: 3, name: "Bananas" },
                { id: 4, name: "Mangos" },
                { id: 5, name: "Lemons" },
                { id: 6, name: "Apricots" }
            ]
        };
    }

    async componentDidMount() {
        const tagsMap: any = {};
        this.state.suggestions.forEach((tag) => {
            tagsMap[tag.id] = tag;
        });

        if (this.props.tags) {
            const selectedTags: Tag[] = [];
            this.props.tags.forEach(tagId => {
                if (tagsMap[tagId]) {
                    selectedTags.push(tagsMap[tagId]);
                }
            });

            this.setState({
                tags: selectedTags
            })
        }
    }


    handleDelete(i: number) {
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1);
        this.setState({ tags })
    }

    handleAddition(tag: Tag) {
        const tags = [].concat(this.state.tags as any, tag as any)
        this.setState({ tags })
    }

    render = () => {
        return (
            <ReactTags
                tags={this.state.tags}
                suggestions={this.state.suggestions}
                handleDelete={this.handleDelete.bind(this)}
                handleAddition={this.handleAddition.bind(this)} />
        );
    };
}
