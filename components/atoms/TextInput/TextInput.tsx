import clsx from "clsx";
import React, {
  ChangeEvent,
  ComponentProps,
  EventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "./TextInput.module.css";

interface Props extends ComponentProps<"input"> {
  value?: string;
  delay?: number;
  defaultValue?: string;
  validate?: (value: string) => boolean;
  onChangeText?: (value: string) => any | void;
  onValidate?: (valid: boolean) => any | void;
}

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export function TextInput({
  type = "text",
  defaultValue = "",
  delay = 500,
  validate = () => true,
  onChangeText = () => {},
  onValidate = () => {},
  autoFocus = false,
  ...props
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(() =>
    defaultValue ? validate(defaultValue) : true
  );

  const onChange: EventHandler<InputChangeEvent> = useCallback(
    ({ target: { value } }) => {
      onChangeText(value);
      const valid = validate(value);
      setIsValid(valid);
      onValidate(valid);
    },
    [onChangeText, onValidate, validate]
  );

  const onKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === "Enter" && !isValid) {
        event.preventDefault();
      }
    },
    [isValid]
  );

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <DebounceInput
      {...(props as DebounceInput<HTMLInputElement>)}
      debounceTimeout={delay}
      autoFocus={autoFocus}
      formNoValidate
      type={type}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className={clsx(styles.textInput, !isValid && styles.invalid)}
    />
  );
}
