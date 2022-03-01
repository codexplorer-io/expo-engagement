import React, { useState } from 'react';
import {
    Modal,
    Title,
    Button,
    useTheme
} from 'react-native-paper';
import styled from 'styled-components/native';
import {
    createStore,
    createHook
} from 'react-sweet-state';
import map from 'lodash/map';
import noop from 'lodash/noop';
import range from 'lodash/range';
import { AntDesign } from '@expo/vector-icons';

const Store = createStore({
    initialState: {
        isOpen: false,
        image: null,
        heading: null,
        renderContent: null,
        pageCount: null,
        currentPage: null,
        actions: null,
        onOpen: null,
        onClose: null
    },
    actions: {
        open: ({
            image = null,
            heading,
            renderContent,
            pageCount = null,
            currentPage = null,
            actions = null,
            onOpen = null,
            onClose = null
        }) => ({ setState }) => {
            setState({
                isOpen: true,
                image,
                heading,
                renderContent,
                pageCount,
                currentPage,
                actions,
                onOpen,
                onClose
            });
            onOpen?.();
        },
        close: () => ({ getState, setState }) => {
            const { isOpen, onClose, actions: oldActions } = getState();
            if (!isOpen) {
                return;
            }

            const actions = map(oldActions, action => ({
                ...action,
                handler: noop
            }));
            setState({
                isOpen: false,
                actions,
                onOpen: null,
                onClose: null
            });
            onClose?.();
        }
    },
    name: 'EngagementModal'
});

const useEngagementModal = createHook(Store);

export const useEngagementModalActions = createHook(Store, { selector: null });

const Root = styled.View`
    background-color: ${({ theme: { colors: { background } } }) => background};
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
`;

const CloseButtonWrapper = styled.View`
    position: absolute;
    width: 30px;
    height: 30px;
    top: -15px;
    right: -15px;
`;

const CloseButtonBackground = styled.View`
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    background-color: ${({ theme: { colors: { background } } }) => background};
    border-radius: 10px;
`;

const PageIndicatorWrapper = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
`;

const PageIndicator = styled.View`
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${({
        theme: { colors: { primary, backgroundDarker } },
        isCurrent
    }) => isCurrent ? primary : backgroundDarker};
    margin-left: 5px;
    margin-right: 5px;
`;

const Content = styled.View`
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`;

const Image = styled.Image`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    margin-bottom: 20px;
`;

const Heading = styled(Title)`
    text-align: center;
    margin-bottom: 10px;
`;

const Actions = styled.View`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    justify-content: center;
`;

export const EngagementModal = () => {
    const [imageWidth, setImageWidth] = useState(0);
    const [{
        isOpen,
        image,
        heading,
        renderContent,
        pageCount,
        currentPage,
        actions
    }, { close }] = useEngagementModal();
    const { colors: { primary } } = useTheme();

    const handleLayout = ({ nativeEvent: { layout: { width } } }) => {
        setImageWidth(width);
    };

    return (
        <Modal visible={isOpen} onDismiss={close}>
            <Root>
                <Content onLayout={handleLayout}>
                    {isOpen && (
                        <>
                            {image && (
                                <Image
                                    key={currentPage ?? 1}
                                    width={imageWidth}
                                    height={imageWidth / image.aspectRatio}
                                    source={image.source}
                                    resizeMode='contain'
                                />
                            )}
                            <Heading>{heading}</Heading>
                            {renderContent()}
                            <Actions>
                                {map(
                                    actions,
                                    ({ label, handler }, index) => (
                                        <Button onPress={handler} key={index}>
                                            {label}
                                        </Button>
                                    )
                                )}
                            </Actions>
                            {currentPage > 0 && pageCount > 0 && (
                                <PageIndicatorWrapper>
                                    {map(range(1, pageCount + 1), page => (
                                        <PageIndicator
                                            key={page}
                                            isCurrent={currentPage === page}
                                        />
                                    ))}
                                </PageIndicatorWrapper>
                            )}
                        </>
                    )}
                </Content>
                <CloseButtonWrapper>
                    <CloseButtonBackground />
                    <AntDesign
                        onPress={close}
                        name='closecircle'
                        size={30}
                        color={primary}
                    />
                </CloseButtonWrapper>
            </Root>
        </Modal>
    );
};
