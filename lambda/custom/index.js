/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-use-before-define */

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
// const https = require('https');

// 1. Handlers ===================================================================================

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const requestAttributes = attributesManager.getRequestAttributes();
    const speechOutput = `${requestAttributes.t('WELCOME')} ${requestAttributes.t('HELP')}`;
    return responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
};

const AboutHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const requestAttributes = attributesManager.getRequestAttributes();

    return responseBuilder
      .speak(requestAttributes.t('ABOUT'))
      .getResponse();
  }
};

const ValueHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'ValueIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const requestAttributes = attributesManager.getRequestAttributes();

    return responseBuilder
      .speak(requestAttributes.t('VALUE'))
      .reprompt(requestAttributes.t('VALUE'))
      .getResponse();
  }
};

const OnSaleHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'OnSaleIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    const item = randomArrayElement(getProductsByItem('onsale'));
    sessionAttributes.item = item.name;
    const speechOutput = `Want a bargain, try ${item.name}. Would you like to hear more?`;

    return responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
};

const SweetHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'SweetIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    const item = randomArrayElement(getProductsByItem('sweet'));
    sessionAttributes.item = item.name;
    const speechOutput = `For sweet, try this, ${item.name}. Would you like to hear more?`;

    return responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
};

const SaltyHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'SaltyIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    const item = randomArrayElement(getProductsByItem('salty'));
    sessionAttributes.item = item.name;
    const speechOutput = `Like salty? ${item.name}. You may also like a soda or a Slushie. Would you like to hear more?`;

    return responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
};

const HotHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'HotIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    const item = randomArrayElement(getProductsByItem('hot'));
    sessionAttributes.item = item.name;
    const speechOutput = `You may enjoy ${item.name} for lunch or dinner. Would you like to hear more?`;

    return responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
};

const CandyHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'CandyIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    const item = randomArrayElement(getProductsByItem('candy'));
    sessionAttributes.item = item.name;
    const speechOutput = `You may enjoy ${item.name}. Would you like to hear more?`;

    return responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
};

const YesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    const itemName = sessionAttributes.item;
    const itemDetails = getItemByName(itemName);
    const speechOutput = `${itemDetails.name} 
      is available ${itemDetails.available}, 
      the sizes available are ${itemDetails.size}, 
      and is, ${itemDetails.description}  
      I have sent these details to your Alexa App.  
      We look forward to seeing you at Mark's Cafe!
      <say-as interpret-as="interjection">bon appetit</say-as>`;

    const card = `${itemDetails.name}\n${itemDetails.available}\n
      \nSizes Available: \n${itemDetails.size}
      \nDescription: \n${itemDetails.description}`;

    return responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, card)
      .getResponse();
  }
};

const PriceHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'PriceIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const responseBuilder = handlerInput.responseBuilder;

    let price = 0;
    if (request.intent.slots.price.value && request.intent.slots.price.value !== '?') {
      price = request.intent.slots.price.value;
    }

    const menuItem = randomArrayElement(getItemsByPrice(price));
    
    const speechOutput = `${menuItem.description}`;

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const requestAttributes = attributesManager.getRequestAttributes();
    return responseBuilder
      .speak(requestAttributes.t('HELP'))
      .reprompt(requestAttributes.t('HELP'))
      .getResponse();
  }
};

const StopHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.NoIntent' ||
        request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const requestAttributes = attributesManager.getRequestAttributes();
    return responseBuilder.speak(requestAttributes.t('STOP')).getResponse();
  }
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const request = handlerInput.requestEnvelope.request;

    console.log(`Error handled: ${error.message}`);
    console.log(` Original request was ${JSON.stringify(request, null, 2)}\n`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.

  //              This handler will not be triggered except in that locale, so it can be

  //              safely deployed for any locale.

  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
  },

  handle(handlerInput) {
    return handlerInput.responseBuilder

      .speak(FALLBACK_MESSAGE)

      .reprompt(FALLBACK_REPROMPT)

      .getResponse();
  }
};

// 2. Constants ==================================================================================

const languageStrings = {
  en: {
    translation: {
      WELCOME: "Welcome to Mark's Cafe!",
      HELP:
        'Say about, to hear more about the ice cream shop, or say sweet, salty, or hot, to hear local item suggestions, or you can ask what\'s on our value menu. ',
      ABOUT:
        'Mark\'s Cafe serves up your favorite fast meals and frozen treats.',
      VALUE:
        'You can ask what\'s on sale, or ask what\'s on the 1, 2, 3 or 4 dollar value menu.',
      STOP: 'Okay, see you next time!'
    }
  }
  // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};

const data = {
  city: 'Los Angeles',
  state: 'CA',
  postcode: '01930',
  products: [
    {
      name: "An Ice Cream Cone",
      available: 'In the Summer',
      size: 'Small, Medium, and Large',
      item: 'sweet',
      description: 'A tasty and beloved treat!'
    },
    {
      name: 'A Novelty Bar',
      available: 'In the Summer',
      size: 'only one size',
      item: 'sweet',
      description: 'A sweet and convenient treat.'
    },
    {
      name: 'A Soda',
      available: 'All Year',
      size: 'Small, Medium, Large and Extra Large',
      item: 'sweet, lunch',
      description: 'Provided by Moxy Brand.'
    },
    {
      name: 'A Hot Dog',
      available: 'All Year',
      size: 'regular and foot long',
      item: 'hot',
      description: 'Made from chicken and beef.'
    },
    {
      name: 'A Shreaded Chicken Sandwich',
      available: 'All Year',
      size: 'only one size',
      item: 'hot',
      description: 'Just like mom used to make, but better.'
    },
    {
      name: 'A Peanut Parfait',
      available: 'In the Summer',
      size: 'Small Medium, and Large',
      item: 'salty',
      description: 'a tasty treat made with spanish peanuts, hot fudge and vanilla ice cream.'
    },
    {
      name: 'A Candy Bar',
      available: 'All Year',
      size: 'Mini, Regular, and King Size',
      item: 'candy',
      description: 'Most of the popular brands are available.'
    },
    {
      name: 'An Avalanche',
      available: 'In the Summer',
      size: 'Small Medium, and Large',
      item: 'sweet, onsale, candy',
      description: 'Available with most popular candy mixed in.'
    },
    {
      name: 'A Slushie',
      available: 'All Year',
      size: 'Small Medium, Large, and Extra Large',
      item: 'sweet',
      description: 'Crushed ice with your favorite fruit flavoring.'
    },
    {
      name: 'Hot Fudge Sundae',
      available: 'In the Summer',
      size: 'Small Medium, and Large',
      item: 'sweet, salty',
      description: 'Available with or without nuts.'
    },
    {
      name: 'Sundae',
      available: 'In the Summer',
      size: 'Small Medium, and Large',
      item: 'sweet',
      description: 'Available with or without nuts.'
    },
    {
      name: 'A Coney Dog',
      available: 'All Year',
      size: 'regular and foot long',
      item: 'hot',
      description: 'Made from chicken and beef and topped with chili sauce. Onions are optional.'
    }
  ],
  prices: [
    {
      name: 'The Special Dollar Menu',
      description:
        'On the special One Dollar Menu is, Ice Cream Cones, Hot Dogs or Small Sodas.',
      price: '1'
    },
    {
      name: 'The Special Dollar Menu',
      description:
        'On the special Two Dollar Menu is, Large Soda, and a Novelty Bar.',
      price: '2'
    },
    {
      name: 'The Special Dollar Menu',
      description:
        'On the special Three Dollar Menu is, Large Avalanche, Shreaded Chicken Sandwich and an Extra Large Soda.',
      price: '3'
    },
    {
      name: 'The Special Dollar Menu',
      description:
        'On the special Four Dollar Menu is, Large Hot Fudge Sundae and a Slushie',
      price: '4'
    }
  ]
};

const SKILL_NAME = 'Mark\'s Cafe';
const FALLBACK_MESSAGE = `The ${SKILL_NAME} skill can\'t help you with that.  It can help you learn about the menu at Mark's Cafe. What can I help you with?`;
const FALLBACK_REPROMPT = 'What can I help you with?';

// 3. Helper Functions ==========================================================================

function getProductsByItem(itemType) {
  const list = [];
  for (let i = 0; i < data.products.length; i += 1) {
    if (data.products[i].item.search(itemType) > -1) {
      list.push(data.products[i]);
    }
  }
  return list;
}

function getItemByName(itemName) {
  let item = {};
  for (let i = 0; i < data.products.length; i += 1) {
    if (data.products[i].name === itemName) {
      item = data.products[i];
    }
  }
  return item;
}

function getItemsByPrice(itemPrice) {
  const list = [];

  for (let i = 0; i < data.prices.length; i += 1) {
    if (data.prices[i].price.search(itemPrice) > -1) {
      list.push(data.prices[i]);
    }
  }
  return list;
}

function randomArrayElement(array) {
  let i = 0;
  i = Math.floor(Math.random() * array.length);
  return array[i];
}

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function(...args) {
      return localizationClient.t(...args);
    };
  }
};

// 4. Export =====================================================================================

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    AboutHandler,
    OnSaleHandler,
    SweetHandler,
    SaltyHandler,
    HotHandler,
    CandyHandler,
    ValueHandler,
    PriceHandler,
    YesHandler,
    HelpHandler,
    StopHandler,
    FallbackHandler,
    SessionEndedHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
