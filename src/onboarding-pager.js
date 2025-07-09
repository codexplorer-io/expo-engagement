import React, { Fragment, useState } from 'react';
import { Animated } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import styled from 'styled-components/native';
import PagerView from 'react-native-pager-view';
import map from 'lodash/map';
import { useDimensions } from '@codexporer.io/react-hooks';
import { useLayout } from '@codexporer.io/expo-layout-state';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeArea = styled(SafeAreaView)`
    flex: 1;
`;

const AnimatedPagerView = styled(Animated.createAnimatedComponent(PagerView))`
    flex: 1;
`;

const Page = styled.View`
    padding-top: 20px;
    display: flex;
    flex: 1;
`;

const Scroll = styled.ScrollView`
    flex: 1;
`;

const IMAGE_MARGIN = 20;
const HeaderImage = styled.Image`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    margin-left: ${IMAGE_MARGIN}px;
    margin-right: ${IMAGE_MARGIN}10px;
    /* background-color: red; */
`;

const Content = styled.View`
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 40px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    /* background-color: blue; */
`;

const PageTitle = styled(Title)`
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    font-size: 28px;
`;

const PageText = styled(Text)`
    text-align: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin-top: 10px;
`;

const PageActions = styled.View`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    justify-content: center;
    flex-wrap: wrap;
`;

const PageAction = styled(Button)`
    margin: 10px;
    margin-bottom: 0;
`;

const PageIndicatorWrapper = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const PageIndicator = styled.View`
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${({ theme, isCurrent }) => isCurrent ? theme.colors.primary : theme.colors.backgroundDarker};
    margin-left: 5px;
    margin-right: 5px;
`;

export const OnboardingPager = ({ pages }) => {
    const { width, height } = useDimensions('window');
    const { currentLayout, setCurrentLayout } = useLayout({ width, height });
    const [selectedPageIndex, setSelectedPageIndex] = useState(0);

    const onPageSelected = ({ nativeEvent: { position } }) => {
        setSelectedPageIndex(position);
    };

    const renderPage = page => (
        <Page
            key={`${page.key}-page`}
            collapsable={false}
        >
            <Scroll>
                {page.image && (
                    <HeaderImage
                        source={page.image.source}
                        width={currentLayout.width - IMAGE_MARGIN * 2}
                        height={
                            Math.floor(
                                currentLayout.height *
                                page.image.viewHeightPercantage
                            )
                        }
                        resizeMode='contain'
                    />
                )}
                <Content>
                    {!!page.title && <PageTitle>{page.title}</PageTitle>}
                    {!!page.text && <PageText>{page.text}</PageText>}
                    {!!page.actions && (
                        <PageActions>
                            {map(page.actions, action => (
                                <Fragment key={action.key}>
                                    <PageAction
                                        onPress={action.handler}
                                        mode='contained'
                                    >
                                        {action.text}
                                    </PageAction>
                                </Fragment>
                            ))}
                        </PageActions>
                    )}
                    {page.footerContent ?? false}
                </Content>
            </Scroll>
        </Page>
    );

    return (
        <SafeArea
            onLayout={event => setCurrentLayout(event.nativeEvent.layout)}
            edges={['right', 'bottom', 'left']}
        >
            {pages.length === 1 && renderPage(pages[0])}
            {pages.length > 1 && (
                <>
                    <AnimatedPagerView
                        initialPage={selectedPageIndex}
                        layoutDirection='ltr'
                        overdrag
                        pageMargin={10}
                        orientation='horizontal'
                        onPageSelected={onPageSelected}
                    >
                        {map(pages, renderPage)}
                    </AnimatedPagerView>
                    <PageIndicatorWrapper>
                        {map(pages, ((page, index) => (
                            <PageIndicator
                                key={`${page.key}-page-indicator`}
                                isCurrent={index === selectedPageIndex}
                            />
                        )))}
                    </PageIndicatorWrapper>
                </>
            )}
        </SafeArea>
    );
};
