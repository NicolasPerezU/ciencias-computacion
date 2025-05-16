import React from 'react';
import { View, Text, Picker } from 'react-native';
import styles from './FilterBar.styles';

const FilterBar = ({ zonas, tipos, selectedZona, setSelectedZona, selectedTipo, setSelectedTipo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.filter}>
        <Text style={styles.label}>Zona:</Text>
        <Picker
          selectedValue={selectedZona}
          onValueChange={(value) => setSelectedZona(value)}
          style={styles.picker}
        >
          <Picker.Item label="Todas" value="todas" />
          {zonas.map((zona, index) => (
            <Picker.Item label={zona} value={zona} key={index} />
          ))}
        </Picker>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Tipo:</Text>
        <Picker
          selectedValue={selectedTipo}
          onValueChange={(value) => setSelectedTipo(value)}
          style={styles.picker}
        >
          <Picker.Item label="Todos" value="todos" />
          {tipos.map((tipo, index) => (
            <Picker.Item label={tipo} value={tipo} key={index} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default FilterBar;

//componente para filtrar por zona y tipo