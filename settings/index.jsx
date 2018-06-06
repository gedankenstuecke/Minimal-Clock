function HelloWorld(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Temperature Settings</Text>}>
        <Select
          label={`Temperature Unit`}
          settingsKey="tempUnit"
          options={[
            {name:"˚C",value:"c"},
            {name:"˚F", value: "f"}
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(HelloWorld);
