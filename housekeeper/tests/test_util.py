from fantasydjhousekeeper import util

def test_strip_to_none():
    assert util.strip_to_none(None) == None
    assert util.strip_to_none('a') == 'a'
    assert util.strip_to_none(' a') == 'a'
    assert util.strip_to_none(' ') == None

def test_get_val():
    d = {}
    d['a'] = 'b'
    d['c'] = ' d'
    assert util.get_val(d, 'a') == 'b'
    assert util.get_val(d, 'b') == None
    assert util.get_val(d, 'c') == 'd'

def __assert_datetime(dt,
                      year,
                      month,
                      day,
                      hour,
                      minute,
                      second):
    assert dt.year == year
    assert dt.month == month
    assert dt.day == day
    assert dt.hour == hour
    assert dt.minute == minute
    assert dt.second == second
    assert str(dt.tzinfo) == 'tzutc()'

def test_date_from_str():
    dt_str = '2017-01-01T00:00:00.000Z'
    dt = util.date_from_str(dt_str)
    __assert_datetime(dt, 2017, 1, 1, 0, 0, 0)

    dt_str = '2009-04-18'
    dt  = util.date_from_str(dt_str)
    __assert_datetime(dt, 2009, 4, 18, 0, 0, 0)

def test_begin_of_day():
    dt = util.date_from_str('2000-05-21T16:30:00.000Z')
    dt2 = util.begin_of_day(dt)
    __assert_datetime(dt2, 2000, 5, 21, 0, 0, 0)

def test_str_from_date():
    dt_str = '2005-03-12'
    dt = util.date_from_str(dt_str)
    dt_str2 = util.str_from_date(dt)
    assert dt_str2 == dt_str
