class Root extends React.Component {
    render() {
        return (
            <h1>Hello World!</h1>
        );
    }
}

const root = document.getElementById('root');
ReactDOM.render(<Root />, root);