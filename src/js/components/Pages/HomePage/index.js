import React from 'react';
import CounterClicker from '../../Shared/CounterClicker';
import PostSelector from '../../Shared/PostSelector';
import PostTable from '../../Shared/PostTable';

//Import Styled Components
import { MainTitleWrapper, MainTitle, PostSection } from './homePageStyles';

const HomePage = () => (
    <div id="page-wrapper">
        <div>
            <MainTitleWrapper>
                <MainTitle>Rix!</MainTitle>
            </MainTitleWrapper>
            <div>
                <CounterClicker />
            </div>
            <hr/>
            <PostSection>
                <PostSelector />
                <PostTable />
            </PostSection>
        </div>
    </div>
);

//IMPORTANT: Notice how dummy components like this one don't need be connected.
HomePage.propTypes = {};
export default HomePage;

// const mapStateToProps = (state) => {
//     return {state};
// };

// export default connect(mapStateToProps)(HomePage);