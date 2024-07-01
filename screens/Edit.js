import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import EditTopBar from '../components/EditTopBar'
import { getDiary, updateDiary } from '../constants/Database'
import useStyles from '../constants/styles'
import { DContexts } from '../contexts/DContexts'

export default function Edit() {
  const css = useStyles()
  const route = useRoute()
  const navigation = useNavigation()
  const diaryid = route.params.id
  const [text, onChangeTitle] = React.useState('')
  const [value, onChangeText] = React.useState('')
  const [diary, setDiary] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [day, setDay] = useState(null)
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  const { changedsomething } = useContext(DContexts)
  const { setChangedSomething } = useContext(DContexts)
  const { txtcolor } = useContext(DContexts)
  useEffect(() => {
    getDiary(diaryid)
      .then((data) => {
        console.log('getDiary data:', data)
        onChangeTitle(data.title)
        onChangeText(data.content)
        setDay(data.day)
        setMonth(data.monthname)
        setYear(data.year)
        setDiary(data)
      })
      .catch((error) => {
        console.error('Failed to get diaries:', error)
      })
  }, [])

  const editDiary = async () => {
    try {
      await updateDiary(diaryid, text, value)
      console.log(value)
      console.log('Diary Updated Successfully')
      setChangedSomething(Math.floor(Math.random() * (5000 - 0 + 1)) + 0)

      navigation.navigate('Diary', { id: diaryid })
    } catch (error) {
      console.error('Failed to insert Diary:', error)
    }
  }

  return (
    <ScrollView style={css.container}>
      <SafeAreaView>
        <EditTopBar acton={editDiary} />
        <View style={{ padding: 10 }}>
          <Text style={css.greytext}>Title</Text>
          <TextInput
            style={{ ...css.txt, ...styles.title_input }}
            onChangeText={onChangeTitle}
            value={text}
            placeholder="Enter your title"
            placeholderTextColor={txtcolor}
          />
          <Text style={css.greytext}>Text</Text>
          <View>
            <TextInput
              editable
              multiline
              numberOfLines={10}
              maxLength={10000}
              placeholder="How are you feeling?"
              onChangeText={(text) => onChangeText(text)}
              value={value}
              style={{ ...css.txt, padding: 15 }}
              textAlignVertical="top"
              autoFocus={true}
              placeholderTextColor={txtcolor}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  title_input: {
    margin: 15,
    padding: 5,
    fontSize: 17,
  },
})
