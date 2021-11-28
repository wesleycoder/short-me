import debounce from "lodash/debounce";
import {
  ChangeEvent,
  ComponentProps,
  EventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface TextInputProps extends ComponentProps<"input"> {
  delay?: number;
  defaultValue?: string;
  validate?: (value: string) => boolean;
  onChangeText: (value: string) => any | void;
  onValidate: (valid: boolean) => any | void;
}

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

const useDebouncedOnChange = (
  onChange: EventHandler<InputChangeEvent>,
  debounceTime: number = 300,
  onAllChanges: EventHandler<InputChangeEvent> = () => {},
) => {
  const handler = useMemo(() =>
    debounce(onChange, debounceTime, {
      trailing: true,
    }), [
    debounceTime,
    onChange,
  ]);

  const handleAll = useCallback(
    (event: InputChangeEvent) => {
      handler(event);
      onAllChanges(event);
    },
    [handler, onAllChanges],
  );

  useEffect(() => () => handler.cancel(), [handler]);

  return handleAll;
};

export function TextInput(
  {
    type = "text",
    defaultValue = "",
    delay = 300,
    validate = () => true,
    onChangeText = () => {},
    onValidate = () => {},
    ...props
  }: TextInputProps,
) {
  const [isValid, setIsValid] = useState(
    () => (defaultValue ? validate(defaultValue) : true)
  );

  const onChange: EventHandler<InputChangeEvent> = useCallback(
    ({ target: { value } }) => onChangeText(value),
    [onChangeText],
  );

  const onKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === "Enter" && !isValid) {
        event.preventDefault();
      }
    },
    [isValid],
  );

  const onAllChanges: EventHandler<InputChangeEvent> = useCallback(
    ({ target: { value } }: InputChangeEvent) => {
      const valid = validate(value);

      if (isValid !== valid) {
        onValidate(valid);
      }

      setIsValid(valid);
    },
    [isValid, onValidate, validate],
  );

  const debouncedHandler = useDebouncedOnChange(onChange, delay, onAllChanges);

  return (
    <input
      {...props}
      formNoValidate
      type={type}
      defaultValue={defaultValue}
      onChange={debouncedHandler}
      onKeyPress={onKeyPress}
    />
  );
}
