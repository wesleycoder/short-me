import throttle from "lodash/throttle";
import {
  ChangeEvent,
  ComponentProps,
  EventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface Props extends ComponentProps<"input"> {
  delay?: number;
  defaultValue?: string;
  validate?: (value: string) => boolean;
  onChangeText: (value: string) => any | void;
  onValidate: (valid: boolean) => any | void;
}

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

const useThrottledOnChange = (
  onChange: EventHandler<InputChangeEvent>,
  delay: number = 300,
  onAllChanges: EventHandler<InputChangeEvent> = () => {},
) => {
  const handler = useMemo(() =>
    throttle(onChange, delay), [
    delay,
    onChange,
  ]);

  const handleAll = useCallback(
    (event: InputChangeEvent) => {
      handler(event);
      onAllChanges(event);
    },
    [handler, onAllChanges],
  );

  useEffect(() => handler.cancel, [handler]);

  return handleAll;
};

export function TextInput(
  {
    type = "text",
    defaultValue = "",
    delay = 500,
    validate = () => true,
    onChangeText = () => {},
    onValidate = () => {},
    autoFocus = false,
    ...props
  }: Props,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(
    () => (defaultValue ? validate(defaultValue) : true),
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

  useEffect(
    () => {
      if (autoFocus) {
        inputRef.current?.focus();
      }
    },
    [autoFocus],
  );

  const throttledValidate = useMemo(
    () => throttle(onValidate, delay, { leading: false }),
    [delay, onValidate],
  );

  const onAllChanges: EventHandler<InputChangeEvent> = useCallback(
    ({ target: { value } }: InputChangeEvent) => {
      const valid = validate(value);

      if (isValid !== valid) {
        throttledValidate(valid);
      }

      setIsValid(valid);
    },
    [throttledValidate, isValid, validate],
  );

  const debouncedHandler = useThrottledOnChange(onChange, delay, onAllChanges);

  return (
    <input
      {...props}
      ref={inputRef}
      autoFocus={autoFocus}
      formNoValidate
      type={type}
      defaultValue={defaultValue}
      onChange={debouncedHandler}
      onKeyPress={onKeyPress}
    />
  );
}
