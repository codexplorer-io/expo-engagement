# expo-engagement
Engagement components for react-native & expo.

## Platform Compatibility
iOS|Android|Web|
-|-|-|
✅|✅|❌|

## Samples

<img title="Engagement 1" src="https://github.com/codexplorer-io/expo-engagement/blob/main/samples/engagement_1.png?raw=true" width="40%"> <img title="Engagement 2" src="https://github.com/codexplorer-io/expo-engagement/blob/main/samples/engagement_2.png?raw=true" width="40%">

## Prerequisites
Module requires a few module dependencies (look at `peerDependencies` within `package.json`) and some theme variable initalizations before it can be used and components redered properly.

Required theme variables:

- **colors.primary** - Primary color used for active page indicator and close icon color
- **colors.background** - Background color
- **colors.backgroundDarker** - Darger background color used for inactive page indicators

```javascript
import { ThemeProvider } from 'styled-components';
import { Provider as PaperProvider } from 'react-native-paper';
import { App } from './app';

const theme = {
    colors: {
        primary: primaryColor,
        background: backgroundColor,
        backgroundDarker: backgroundDarkerColor,
        ...
    },
    ...
};

export const AppThemeWrapper = () => (
    <ThemeProvider theme={theme}>
        <PaperProvider theme={theme}>
            <App />
        </PaperProvider>
    </ThemeProvider>
);
```

Before engagement modal can be displayed, it needs to be rendered within `App` as a descendant of theme providers:
```javascript
import { EngagementModal } from '@codexporer.io/expo-engagement';
...

export const App = () => (
    <>
        ...other components
        <EngagementModal />
    </>
);
```

## Usage

Engagement modal is simple for use component. Everything needed is provided through `useEngagementModalActions` hook:
```javascript
import { useEngagementModalActions } from '@codexporer.io/expo-engagement';
...

export const MyComponent = () => {
    const [, { open, close }] = useEngagementModalActions();
    const [currentStep, setCurrentStep] = useState(0);

    const onShowModal = () => {
        open({
            image: {
                source: imageSource,
                aspectRatio: 1.5
            },
            heading: 'Modal Heading',
            renderContent: () => (
                <>
                    <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</Text>
                    <Text>...</Text>
                    ...
                </>
            ),
            pageCount: 3,
            currentPage: 1,
            actions: [
                {
                    handler: () => setCurrentStep(1),
                    label: 'Next'
                }
            ],
            onOpen: () => {
                // ...
            },
            onClose: () => {
                close();
            }
        });
    };
    
    const onCloseModal = () => {
        close();
    };

    return ...;
};
```

## Exports
symbol|description|
-|-|
EngagementModal|Engagement modal component|
useEngagementModalActions|hook used to control the engagement modal|

## useEngagementModalActions
Returns an array with `open` and `close` actions on the second index:
```javascript
const [, { open, close }] = useEngagementModalActions();

...
open(...options);
...
close();
```

### Open engagement modal action parameters
parameter|description|
-|-|
image|Object with `source` and `aspectRatio`, where `source` is image source, and `aspectRatio` is aspect ratio of the image. If provided, image will be displayed in modal header.|
heading|Heading displayed on engagement modal.|
renderContent|Function that renders modal content.|
pageCount|Number of the pages, if multiple pages should be displayed. If provided will be used to render the pager number of the pages.|
currentPage|Number of the current page. If provided will be used to render highlight current page within the pager. For pager indicator to be visible, both `pageCount` and `currentPage` should be larger than 0.|
actions|Actions to be rendered as modal buttons. Each action contains object with properties `label` and `handler`. Label is used as a button label, while handler is invoked when button is clicked.|
onOpen|Callback invoked when engagement modal is displayed.|
onClose|Callback invoked when engagement modal is closed.|
