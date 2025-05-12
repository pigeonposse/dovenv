# `@dovenv/ai` - API documentation

## Functions

### aiPlugin()

```ts
function aiPlugin(conf?: Config): Config
```

Local AI assistant plugin for dovenv.

This function generates a configuration for a local AI assistant, allowing
users to select different chat configurations using keys. The configuration
includes a description and options for selecting a specific chat configuration
by key. The function also defines the behavior for running the assistant
with the selected configuration.

---.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conf`? | [`Config`](#config) | Optional configuration object for the plugin. |

#### Returns

`Config`

- Dovenv configuration for the plugin.

***

### run()

```ts
function run(config: FnParams): Promise<void>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `FnParams` |

#### Returns

`Promise`\<`void`\>

## Type Aliases

### Config

```ts
type Config: {
  chat: Record<string, EnvAiConfig>;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `chat`? | `Record`\<`string`, `EnvAiConfig`\> | Configuration for local AI assistant chats |

## References

### default

Renames and re-exports [aiPlugin](#aiplugin)
