import { UserAddRequest } from '@Api/User/type'
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from '@Constant/index'
import { createAppForm } from '@Utils/CreateAppForm'
import { countryIdValidation } from '@Utils/Validation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const UserAppForm = createAppForm<UserAddRequest>()

const UserCreateKnowledge: React.FC= () => {

    const { t } = useTranslation()

    const Genderoptions: DropdownItemProps[] = [
        { text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
        { text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
    ]

    return <React.Fragment>
        <Form.Group widths={'equal'}>
            <UserAppForm.Input name='CountryID' label={t('Pages.Users.Prepare.Label.CountryID')} rules={{ validate: (value) => countryIdValidation(value, t('Pages.Users.Messages.CountryIDRequired')) }} />
            <UserAppForm.Select name='Gender' label={t('Pages.Users.Prepare.Label.Gender')} options={Genderoptions} />
            <UserAppForm.Input name='Dateofbirth' label={t('Pages.Users.Prepare.Label.Dateofbirth')} type='date' />
            <UserAppForm.Input name='Phonenumber' label={t('Pages.Users.Prepare.Label.Phonenumber')} />
        </Form.Group>
        <Form.Group widths={'equal'}>
            <UserAppForm.Input name='Bloodgroup' label={t('Pages.Users.Prepare.Label.Bloodgroup')} />
            <UserAppForm.Input name='Foreignlanguage' label={t('Pages.Users.Prepare.Label.Foreignlanguage')} />
            <UserAppForm.Input name='Graduation' label={t('Pages.Users.Prepare.Label.Graduation')} />
            <UserAppForm.Input name='Chronicillness' label={t('Pages.Users.Prepare.Label.Chronicillness')} />
        </Form.Group>
        <Form.Group widths={'equal'}>
            <UserAppForm.Input name='Covid' label={t('Pages.Users.Prepare.Label.Covid')} />
            <UserAppForm.Input name='Contactnumber' label={t('Pages.Users.Prepare.Label.Contactnumber')} />
            <UserAppForm.Input name='City' label={t('Pages.Users.Prepare.Label.City')} />
            <UserAppForm.Input name='Town' label={t('Pages.Users.Prepare.Label.Town')} />
        </Form.Group>
        <Form.Group widths={'equal'}>
            <UserAppForm.Input name='Adress' label={t('Pages.Users.Prepare.Label.Adress')} />
        </Form.Group>
    </React.Fragment>
}
export default UserCreateKnowledge