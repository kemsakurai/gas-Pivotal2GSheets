import rewire from "rewire";
const getPTStories = rewire("./getPTStories.ts");

describe("getPTStories Test", () => {

  test('undefined description', () => {
    const story = {
      story_type: "bug",
      description: undefined
    }
    const getTimeOfFailureAndResolution = getPTStories.__get__('getTimeOfFailureAndResolution');
    expect(getTimeOfFailureAndResolution(story)).toEqual({
      timeOfFailure: '',
      timeOfFailureResolution: ''
    });
  });

  test('story_type is story', () => {
    const story = {
      story_type: "story",
      description: "障害発生日時\n" +
        "2024/01/02 11:22:00\n" +
        "障害解消日時\n" +
        "2024/01/04 12:00:00\n"
    }
    const getTimeOfFailureAndResolution = getPTStories.__get__('getTimeOfFailureAndResolution');
    expect(getTimeOfFailureAndResolution(story)).toEqual({
      timeOfFailure: '',
      timeOfFailureResolution: ''
    });
  });

  test('story_type is bug', () => {
    const story = {
      story_type: "bug",
      description: "障害発生日時\n" +
        "2024/01/02 11:22:00\n" +
        "障害解消日時\n" +
        "2024/01/04 12:00:00\n"
    }
    const getTimeOfFailureAndResolution = getPTStories.__get__('getTimeOfFailureAndResolution');
    expect(getTimeOfFailureAndResolution(story)).toEqual({
      timeOfFailure: '2024/01/02 11:22:00',
      timeOfFailureResolution: '2024/01/04 12:00:00'
    });
  });
})
