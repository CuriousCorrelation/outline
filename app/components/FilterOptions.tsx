import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMenuState, MenuButton } from "reakit/Menu";
import styled from "styled-components";
import Button, { Inner } from "~/components/Button";
import ContextMenu from "~/components/ContextMenu";
import MenuItem from "~/components/ContextMenu/MenuItem";
import Text from "~/components/Text";
import InputSearch from "./InputSearch";
import PaginatedList from "./PaginatedList";

type TFilterOption = {
  key: string;
  label: string;
  note?: string;
};

type Props = {
  options: TFilterOption[];
  column: string;
  activeKey: string | null | undefined;
  defaultLabel?: string;
  selectedPrefix?: string;
  className?: string;
  onSelect: (key: string | null | undefined) => void;
};

const FilterOptions = ({
  options,
  column = "",
  activeKey = "",
  defaultLabel = "Filter options",
  selectedPrefix = "",
  className,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const menu = useMenuState({
    modal: true,
  });

  const selected =
    options.find((option) => option.key === activeKey) || options[0];

  const selectedLabel = selected ? `${selectedPrefix} ${selected.label}` : "";

  const [filteredData, setFilteredData] = React.useState<TFilterOption[]>([]);

  // User should see prior search results first when clicking on author dropdown.
  // If user clicks on search box, they should see all available authors.
  const handleFocus = React.useCallback(() => {
    setFilteredData(options);
  }, [options]);

  // Checks if text appears in any author's name.
  // Case-insensitive.
  const handleFilter = React.useCallback(
    (event) => {
      const { value } = event.target;
      if (value) {
        const filteredData = options.filter((user) =>
          user.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filteredData);
      }
    },
    [options]
  );

  React.useEffect(() => {
    setFilteredData(options);
  }, [options]);

  return (
    <Wrapper>
      <MenuButton {...menu}>
        {(props) => (
          <StyledButton {...props} className={className} neutral disclosure>
            {activeKey ? selectedLabel : defaultLabel}
          </StyledButton>
        )}
      </MenuButton>
      <ContextMenu aria-label={defaultLabel} {...menu}>
        {column === "authors" && (
          <InputSearch
            onChange={handleFilter}
            onFocus={handleFocus}
            placeholder={`${t("Filter")}…`}
          />
        )}
        {filteredData.map((option) => (
          <MenuItem
            key={option.key}
            onClick={() => {
              onSelect(option.key);
              menu.hide();
            }}
            selected={option.key === activeKey}
            {...menu}
          >
            {option.note ? (
              <LabelWithNote>
                {option.label}
                <Note>{option.note}</Note>
              </LabelWithNote>
            ) : (
              option.label
            )}
          </MenuItem>
        ))}
      </ContextMenu>
    </Wrapper>
  );
};

const Note = styled(Text)`
  margin-top: 2px;
  margin-bottom: 0;
  line-height: 1.2em;
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.textTertiary};
`;

const LabelWithNote = styled.div`
  font-weight: 500;
  text-align: left;

  &:hover ${Note} {
    color: ${(props) => props.theme.white50};
  }
`;

const StyledButton = styled(Button)`
  box-shadow: none;
  text-transform: none;
  border-color: transparent;
  height: auto;

  &:hover {
    background: transparent;
  }

  ${Inner} {
    line-height: 24px;
    min-height: auto;
  }
`;

const Wrapper = styled.div`
  margin-right: 8px;
`;

export default FilterOptions;
